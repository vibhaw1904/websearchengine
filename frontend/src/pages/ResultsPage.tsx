import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { streamChat, Source } from '../api/chat'
import Header from '../components/Header'
import SourceCard from '../components/SourceCard'
import FollowUpQuestions from '../components/FollowUpQuestions'
import SkeletonLoader from '../components/SkeletonLoader'

export default function ResultsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') ?? ''

  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState<Source[]>([])
  const [followUps, setFollowUps] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDone, setIsDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cancelRef = useRef<boolean>(false)

  useEffect(() => {
    if (!query) return

    cancelRef.current = true
    setAnswer('')
    setSources([])
    setFollowUps([])
    setIsLoading(true)
    setIsDone(false)
    setError(null)

    cancelRef.current = false

    streamChat(query, {
      onAnswer(chunk) {
        if (cancelRef.current) return
        setIsLoading(false)
        setAnswer((prev) => prev + chunk)
      },
      onSources(s) {
        if (cancelRef.current) return
        setSources(s)
      },
      onFollowUps(q) {
        if (cancelRef.current) return
        setFollowUps(q)
      },
      onDone() {
        if (cancelRef.current) return
        setIsLoading(false)
        setIsDone(true)
      },
      onError(err) {
        if (cancelRef.current) return
        setIsLoading(false)
        setIsDone(true)
        setError(err.message)
      },
    })

    return () => {
      cancelRef.current = true
    }
  }, [query])

  function handleReSearch(q: string) {
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header currentQuery={query} onSearch={handleReSearch} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        {isLoading && !answer ? (
          <SkeletonLoader />
        ) : (
          <div className="fade-in space-y-8">
            {/* Query echo */}
            <h2 className="text-2xl font-semibold text-text-primary leading-snug">
              {query}
            </h2>

            {/* Thin cyan divider */}
            <div className="border-t border-border-accent opacity-40" />

            {/* Sources */}
            {sources.length > 0 && (
              <section>
                <p className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-1">
                  Sources
                </p>
                <div>
                  {sources.map((s, i) => (
                    <SourceCard key={s.url + i} title={s.title} url={s.url} index={i + 1} />
                  ))}
                </div>
              </section>
            )}

            {/* Answer */}
            {(answer || error) && (
              <section>
                <p className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-4">
                  Answer
                </p>
                {error ? (
                  <div className="border border-red-900 bg-red-950/20 px-4 py-3 text-red-400 text-sm font-mono">
                    {error}
                  </div>
                ) : (
                  <p
                    className={`text-text-primary font-mono text-sm leading-7 whitespace-pre-wrap${
                      !isDone ? ' cursor-blink' : ''
                    }`}
                  >
                    {answer}
                  </p>
                )}
              </section>
            )}

            {/* Follow-ups */}
            {isDone && followUps.length > 0 && (
              <FollowUpQuestions questions={followUps} onSelect={handleReSearch} />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
