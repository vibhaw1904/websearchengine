import json
import logging
import re

import httpx
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from ...schemas import ChatRequest
from ...core.config import settings
from ...core.prompt import SYSTEM_PROMPT, PROMPT_TEMPLATE, format_search_results
from tavily import TavilyClient

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = TavilyClient(settings.tavily_api_key)

OPENROUTER_CHAT_COMPLETIONS_URL = "https://openrouter.ai/api/v1/chat/completions"

ANSWER_OPEN = "<ANSWER>"
ANSWER_CLOSE = "</ANSWER>"
FOLLOW_UPS_OPEN = "<FOLLOW_UPS>"
FOLLOW_UPS_CLOSE = "</FOLLOW_UPS>"

router = APIRouter(prefix="/api/v1", tags=["chat"])


def sse_event(event: str, data: str) -> str:
    data_lines = "\n".join(f"data: {line}" for line in data.split("\n"))
    return f"event: {event}\n{data_lines}\n\n"


async def stream_llm_response(user_message: str, sources: list[dict]):
    raw = ""
    answer_open_found = False
    sent_answer_upto = 0
    answer_close_idx = None
    follow_ups_open_idx = None
    follow_ups_close_idx = None

    async with httpx.AsyncClient(timeout=60.0) as http_client:
        async with http_client.stream(
            "POST",
            OPENROUTER_CHAT_COMPLETIONS_URL,
            headers={
                "Authorization": f"Bearer {settings.openrouter_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.openrouter_model,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_message},
                ],
                "max_tokens": 1000,
                "temperature": 0.7,
                "stream": True,
            },
        ) as llm_response:
            logger.info("OpenRouter response status: %s", llm_response.status_code)

            if llm_response.status_code >= 400:
                error_body = await llm_response.aread()
                logger.error(
                    "OpenRouter API error %s: %s",
                    llm_response.status_code,
                    error_body.decode(errors="replace"),
                )
                yield sse_event("error", json.dumps({"message": "LLM request failed"}))
                return

            async for line in llm_response.aiter_lines():
                if not line.startswith("data:"):
                    continue

                data = line[len("data:"):].strip()
                if data == "[DONE]":
                    break

                try:
                    chunk = json.loads(data)
                except json.JSONDecodeError:
                    logger.warning("Could not parse chunk as JSON: %s", data)
                    continue

                delta = chunk["choices"][0].get("delta", {}).get("content", "")
                if not delta:
                    continue

                # Growing transcript (not a cleared buffer) so a tag split across chunks is never missed
                raw += delta

                if not answer_open_found:
                    idx = raw.find(ANSWER_OPEN)
                    if idx == -1:
                        continue
                    answer_open_found = True
                    sent_answer_upto = idx + len(ANSWER_OPEN)

                if answer_close_idx is None:
                    idx = raw.find(ANSWER_CLOSE, sent_answer_upto)
                    if idx != -1:
                        answer_close_idx = idx
                        new_text = raw[sent_answer_upto:answer_close_idx]
                        if new_text:
                            yield sse_event("answer", new_text)
                        sent_answer_upto = answer_close_idx + len(ANSWER_CLOSE)
                    else:
                        # Hold back a tail long enough to still become "</ANSWER>" later
                        safe_upto = max(sent_answer_upto, len(raw) - (len(ANSWER_CLOSE) - 1))
                        if safe_upto > sent_answer_upto:
                            yield sse_event("answer", raw[sent_answer_upto:safe_upto])
                            sent_answer_upto = safe_upto
                        continue

                if follow_ups_open_idx is None:
                    idx = raw.find(FOLLOW_UPS_OPEN, sent_answer_upto)
                    if idx == -1:
                        continue
                    follow_ups_open_idx = idx + len(FOLLOW_UPS_OPEN)

                if follow_ups_close_idx is None:
                    idx = raw.find(FOLLOW_UPS_CLOSE, follow_ups_open_idx)
                    if idx != -1:
                        follow_ups_close_idx = idx

    logger.info("Raw LLM output: %r", raw)
    if answer_close_idx is None or follow_ups_close_idx is None:
        logger.warning("LLM stream ended without closing all expected tags.")

    follow_ups_text = ""
    if follow_ups_open_idx is not None:
        end = follow_ups_close_idx if follow_ups_close_idx is not None else len(raw)
        follow_ups_text = raw[follow_ups_open_idx:end]

    follow_up_questions = [
        q.strip() for q in re.findall(r"<question>(.*?)</question>", follow_ups_text, re.DOTALL)
    ]
    logger.info("Parsed follow-up questions: %r", follow_up_questions)
    yield sse_event("follow_up_questions", json.dumps(follow_up_questions))
    yield sse_event("sources", json.dumps(sources))
    yield sse_event("done", "{}")


@router.post("/chat")
async def chat(chat_request: ChatRequest):
    query = chat_request.query

    # TODO: verify user has access/credits to hit the endpoint
    # TODO: check if we already have a cached web search for a similar query

    response = client.search(
        query=query,
        search_depth="advanced",
    )

    web_search_results = response.get("results", [])
    logger.info("Tavily returned %d results for query: %r", len(web_search_results), query)

    user_message = PROMPT_TEMPLATE.substitute(
        user_query=query,
        search_results=format_search_results(web_search_results),
    )

    sources = [
        {"title": result.get("title", "Untitled"), "url": result.get("url", "")}
        for result in web_search_results
    ]

    return StreamingResponse(
        stream_llm_response(user_message, sources),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )
