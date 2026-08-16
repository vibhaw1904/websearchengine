from fastapi import APIRouter
from ..schemas import ChatRequest
from ..core.config import settings
from tavily import TavilyClient

client = TavilyClient(settings.tavily_api_key)


router = APIRouter(tags=["chat"])

@router.post("/chat")
async def chat(chat_request: ChatRequest):
    # get the query from the user
    query = chat_request.query

    #make sure user has access/credits to hit the endpoint



    # check if we have web search indexed for a similar query

    #  web search to gather resources

    response = client.search(
    query=query,
    search_depth="advanced"
    )
    print(response)
    # do some context engineering to create a prompt for the LLM + web search respnses

    #hit the LLm and stream bavk the response to the user

    #also stream back the sources and the follow up questions (which we can get from another parallel LLm call)
    return {"message": "This is a placeholder for the chat endpoint."}
    pass