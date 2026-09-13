import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'

const EXAMPLE_QUERIES = [
  'How does a neural network learn?',
  'Latest breakthroughs in quantum computing',
  'Why is the sky blue?',
  'Best open source LLMs in 2025',
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="h-screen bg-bg flex flex-col items-center justify-center px-6 relative">
      <main className="flex flex-col items-center w-full max-w-2xl mx-auto gap-8 fade-in">
        {/* Wordmark */}
        <div className="text-center">
          <h1 className="text-6xl font-bold tracking-tight text-text-primary">
            AETHER
          </h1>
          <p className="text-text-secondary font-mono text-sm mt-2 tracking-widest uppercase">
            Search. Think. Know.
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full">
          <SearchBar autoFocus />
        </div>

        {/* Example query chips */}
        <div className="flex flex-wrap justify-center gap-3">
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)}
              className="cursor-pointer text-text-secondary text-sm font-mono hover:text-accent transition-colors duration-150 border border-border px-3 py-1.5 rounded-sm hover:border-accent"
            >
              {q}
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <p className="absolute bottom-6 text-xs text-border font-mono">
        © 2025 Aether
      </p>
    </div>
  )
}
