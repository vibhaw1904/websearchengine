import { FormEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface SearchBarProps {
  initialValue?: string
  autoFocus?: boolean
  onSearch?: (q: string) => void
}

export default function SearchBar({
  initialValue = '',
  autoFocus = false,
  onSearch,
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    if (onSearch) {
      onSearch(q)
    } else {
      navigate(`/search?q=${encodeURIComponent(q)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center border border-border hover:border-text-secondary focus-within:border-accent transition-colors duration-150 bg-bg-card">
        {/* search icon */}
        <svg
          className="w-4 h-4 text-text-secondary ml-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 bg-transparent px-4 py-3.5 text-text-primary placeholder-text-secondary font-mono text-sm outline-none"
        />

        <button
          type="submit"
          className="bg-accent text-bg px-4 py-3.5 text-xs font-semibold uppercase tracking-wider hover:bg-accent-dim transition-colors duration-150 flex-shrink-0"
          aria-label="Search"
        >
          Search
        </button>
      </div>
    </form>
  )
}
