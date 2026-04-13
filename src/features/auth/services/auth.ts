import { sleep } from '@/lib/utils'

type MockUser = {
  email: string
  role: string[]
}
export type AuthenticateResult =
  | { status: 'ok'; user: Omit<MockUser & { password: string }, 'password'> }
  | { status: 'error'; reason: 'email_not_found' | 'invalid_password' | 'account_blocked' }

export async function authenticate(email: string, password: string): Promise<AuthenticateResult> {
  await sleep(500)

  const normalizedEmail = String(email).trim().toLowerCase()
  const storedUsersRaw = localStorage.getItem('local-users')

  if (storedUsersRaw) {
    try {
      const users = JSON.parse(storedUsersRaw) as Array<{
        email?: string
        status?: string
        role?: string[]
      }>
      const matched = users.find(
        (user) => String(user.email ?? '').trim().toLowerCase() === normalizedEmail,
      )

      if (!matched) {
        return { status: 'error', reason: 'email_not_found' }
      }

      if (['inactive', 'suspended'].includes(String(matched.status))) {
        return { status: 'error', reason: 'account_blocked' }
      }

      if (!password) {
        return { status: 'error', reason: 'invalid_password' }
      }

      return {
        status: 'ok',
        user: {
          email: matched.email ?? normalizedEmail,
          role: matched.role ?? ['general_administrator'],
        },
      }
    } catch {
      // Keep auth flow resilient if local users cache is malformed.
    }
  }

  if (normalizedEmail !== 'user@sigas.com') {
    return { status: 'error', reason: 'email_not_found' }
  }

  if (!password) return { status: 'error', reason: 'invalid_password' }

  return { 
    status: 'ok', 
    user: {
        email: normalizedEmail,
        role: ['general_administrator'],
    }
  }
}
