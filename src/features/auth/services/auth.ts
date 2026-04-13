import { sleep } from '@/lib/utils'

type MockUser = {
  email: string
  role: string[]
}

type AuthLocalUser = {
  email: string
  password: string
  status?: string
  role?: string[]
}

export type AuthenticateResult =
  | { status: 'ok'; user: Omit<MockUser & { password: string }, 'password'> }
  | { status: 'error'; reason: 'email_not_found' | 'invalid_password' | 'account_blocked' }

export async function authenticate(email: string, password: string): Promise<AuthenticateResult> {
  await sleep(500)

  const normalizedEmail = email.trim().toLowerCase()
  const registeredUsersRaw = localStorage.getItem('auth-users')

  if (registeredUsersRaw) {
    try {
      const users = JSON.parse(registeredUsersRaw) as AuthLocalUser[]
      const found = users.find((user) => user.email.trim().toLowerCase() === normalizedEmail)

      if (!found) {
        return { status: 'error', reason: 'email_not_found' }
      }

      if (['inactive', 'suspended'].includes(String(found.status ?? 'active'))) {
        return { status: 'error', reason: 'account_blocked' }
      }

      if (found.password !== password) {
        return { status: 'error', reason: 'invalid_password' }
      }

      return {
        status: 'ok',
        user: {
          email: found.email,
          role: found.role && found.role.length > 0 ? found.role : ['general_administrator'],
        },
      }
    } catch {
      // Keep auth flow resilient if local users cache is malformed.
    }
  }

  // Fallback para ambiente sem cadastro prévio.
  if (!password) return { status: 'error', reason: 'invalid_password' }

  return { 
    status: 'ok', 
    user: {
        email: normalizedEmail || 'user@sigas.com',
        role: ['general_administrator'],
    }
  }
}
