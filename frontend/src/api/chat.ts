export interface Source {
  title: string
  url: string
}

export interface StreamCallbacks {
  onAnswer: (chunk: string) => void
  onSources: (sources: Source[]) => void
  onFollowUps: (questions: string[]) => void
  onDone: () => void
  onError: (err: Error) => void
}

export async function streamChat(
  query: string,
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  let response: Response

  try {
    const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
    const token = localStorage.getItem('aether_token')
    response = await fetch(`${apiBase}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ query }),
      signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return
    callbacks.onError(err instanceof Error ? err : new Error(String(err)))
    return
  }

  if (!response.ok) {
    callbacks.onError(new Error(`Server error: ${response.status}`))
    return
  }

  const reader = response.body?.getReader()
  if (!reader) {
    callbacks.onError(new Error('No response body'))
    return
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // SSE messages are separated by double newlines
      const parts = buffer.split('\n\n')
      // Keep the last (possibly incomplete) part in the buffer
      buffer = parts.pop() ?? ''

      for (const part of parts) {
        if (!part.trim()) continue

        let eventName = ''
        let dataLine = ''

        for (const line of part.split('\n')) {
          if (line.startsWith('event:')) {
            eventName = line.slice('event:'.length).trim()
          } else if (line.startsWith('data:')) {
            // Strip only the single SSE separator space, not content-leading spaces
            dataLine = line.startsWith('data: ')
              ? line.slice('data: '.length)
              : line.slice('data:'.length)
          }
        }

        if (!eventName || !dataLine) continue

        switch (eventName) {
          case 'answer':
            callbacks.onAnswer(dataLine)
            break
          case 'sources':
            try {
              callbacks.onSources(JSON.parse(dataLine) as Source[])
            } catch {
              // ignore malformed JSON
            }
            break
          case 'follow_up_questions':
            try {
              callbacks.onFollowUps(JSON.parse(dataLine) as string[])
            } catch {
              // ignore malformed JSON
            }
            break
          case 'done':
            callbacks.onDone()
            break
          case 'error':
            try {
              const { message } = JSON.parse(dataLine) as { message: string }
              callbacks.onError(new Error(message))
            } catch {
              callbacks.onError(new Error('Stream error'))
            }
            break
        }
      }
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return
    callbacks.onError(err instanceof Error ? err : new Error(String(err)))
  } finally {
    reader.releaseLock()
  }
}
