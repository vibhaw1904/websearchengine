import { Link, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'
import { useAuth } from '../context/AuthContext'

interface HeaderProps {
  currentQuery: string
  onSearch: (q: string) => void
}

export default function Header({ currentQuery, onSearch }: HeaderProps) {
  const { clearToken } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    clearToken()
    navigate('/login')
  }

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
        {/* Logout — small, unobtrusive */}
        <button
          onClick={handleLogout}
          className="flex-shrink-0 text-xs font-mono text-text-secondary hover:text-accent transition-colors duration-150"
        >
          sign out
        </button>
      </div>
    </header>
  )
}
