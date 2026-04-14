import { sleep } from '@/lib/utils'

const MOCK_EMAILS = [
  'admin@gmail.com',
  'admin1@gmail.com',
  'admin2@gmail.com',
  'admin3@gmail.com',
]
const MOCK_PASSWORD = 'admin123'

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

export type ChangePasswordResult =
  | { status: 'ok' }
  | { status: 'error'; reason: 'invalid_old_password' | 'user_not_found' | 'passwords_dont_match' }

export async function authenticate(email: string, password: string): Promise<AuthenticateResult> {
  await sleep(500)

  const normalizedEmail = String(email).trim().toLowerCase()
  const storedUsersRaw = localStorage.getItem('auth-users')

  if (storedUsersRaw) {
    try {
      const users = JSON.parse(storedUsersRaw) as AuthLocalUser[]
      const matched = users.find(
        (user) => String(user.email ?? '').trim().toLowerCase() === normalizedEmail,
      )

      if (matched) {
        if (['inactive', 'suspended'].includes(String(matched.status))) {
          return { status: 'error', reason: 'account_blocked' }
        }

        if (matched.password !== password) {
          return { status: 'error', reason: 'invalid_password' }
        }

        return {
          status: 'ok',
          user: {
            email: matched.email ?? normalizedEmail,
            role: matched.role ?? ['general_administrator'],
          },
        }
      }
    } catch {
      // Keep auth flow resilient if local users cache is malformed.
    }
  }

  if (!MOCK_EMAILS.includes(normalizedEmail)) {
    return { status: 'error', reason: 'email_not_found' }
  }

  if (password !== MOCK_PASSWORD) return { status: 'error', reason: 'invalid_password' }

  return { 
    status: 'ok', 
    user: {
        email: normalizedEmail,
        role: ['general_administrator'],
    }
  }
}

export async function changePassword(
  email: string,
  oldPassword: string,
  newPassword: string,
): Promise<ChangePasswordResult> {
  await sleep(500)

  const normalizedEmail = String(email).trim().toLowerCase()
  const storedUsersRaw = localStorage.getItem('auth-users')

  if (storedUsersRaw) {
    try {
      const users = JSON.parse(storedUsersRaw) as AuthLocalUser[]
      const userIndex = users.findIndex(
        (user) => String(user.email ?? '').trim().toLowerCase() === normalizedEmail,
      )

      if (userIndex === -1) {
        return { status: 'error', reason: 'user_not_found' }
      }

      const user = users[userIndex]

      if (user.password !== oldPassword) {
        return { status: 'error', reason: 'invalid_old_password' }
      }

      // Update password
      users[userIndex].password = newPassword
      localStorage.setItem('auth-users', JSON.stringify(users))

      return { status: 'ok' }
    } catch {
      return { status: 'error', reason: 'user_not_found' }
    }
  }

  // If no stored users, cannot change password for mock users
  return { status: 'error', reason: 'user_not_found' }
}
