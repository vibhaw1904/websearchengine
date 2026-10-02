import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { saveToken } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { access_token } = await login(email, password)
      saveToken(access_token)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm fade-in">

        {/* Wordmark */}
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-bold tracking-tight text-text-secondary hover:text-text-primary transition-colors duration-150">
            AETHER
          </Link>
        </div>

        {/* Form card — cyan top-line anchor, no shadow */}
        <div className="border border-border bg-bg-surface" style={{ borderTop: '2px solid #00E5FF' }}>
          <div className="px-8 py-8">
            <h2 className="text-text-primary font-semibold text-lg mb-6 tracking-tight">
              Sign in
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary text-xs font-mono" htmlFor="email">
                  email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-bg border border-border text-text-primary text-sm px-3 py-2.5 outline-none font-mono
                    focus:border-accent transition-colors duration-150 placeholder-[#333]"
                  placeholder="you@example.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary text-xs font-mono" htmlFor="password">
                  password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-bg border border-border text-text-primary text-sm px-3 py-2.5 outline-none font-mono
                    focus:border-accent transition-colors duration-150 placeholder-[#333]"
                  placeholder="••••••••"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs font-mono text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full border border-accent text-accent text-sm font-mono py-2.5
                  hover:bg-accent hover:text-bg transition-colors duration-150
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'signing in…' : 'sign in'}
              </button>
            </form>
          </div>

          {/* Footer link */}
          <div className="border-t border-border px-8 py-4 text-center">
            <span className="text-text-secondary text-xs font-mono">
              no account?{' '}
              <Link to="/register" className="text-accent hover:text-accent-dim transition-colors duration-150">
                create one
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
