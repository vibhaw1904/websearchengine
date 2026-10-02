import { createContext, useContext, useState, ReactNode } from 'react'

const TOKEN_KEY = 'aether_token'

interface AuthContextValue {
  token: string | null
  saveToken: (token: string) => void
  clearToken: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY),
  )

  function saveToken(t: string) {
    localStorage.setItem(TOKEN_KEY, t)
    setToken(t)
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, saveToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook for consuming auth state anywhere in the tree
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
