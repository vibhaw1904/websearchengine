import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'

interface HeaderProps {
  currentQuery: string
  onSearch: (q: string) => void
}

export default function Header({ currentQuery, onSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-bg border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-6">
        <Link to="/" className="flex-shrink-0">
          <span className="text-xl font-bold tracking-tight text-text-primary hover:text-accent transition-colors duration-150">
            AETHER
          </span>
        </Link>
        <div className="flex-1">
          <SearchBar initialValue={currentQuery} onSearch={onSearch} />
        </div>
      </div>
    </header>
  )
}
