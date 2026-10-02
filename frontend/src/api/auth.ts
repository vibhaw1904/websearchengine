const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface AuthResponse {
  access_token: string
  token_type: string
}

// Calls /register and returns JWT on success; throws on failure
export async function register(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail ?? 'Registration failed')
  return data as AuthResponse
}

// Calls /login and returns JWT on success; throws on failure
export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail ?? 'Login failed')
  return data as AuthResponse
}
