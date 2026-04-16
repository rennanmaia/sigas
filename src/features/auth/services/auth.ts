import { sleep } from '@/lib/utils'

const MOCK_EMAILS = [
  'admin@gmail.com',
  'admin1@gmail.com',
  'admin2@gmail.com',
  'admin3@gmail.com',
]
const MOCK_PASSWORD = 'admin123'
const AUTH_USERS_KEY = 'auth-users'
const LOCAL_USERS_KEY = 'local-users'
const BLOCKED_ACCOUNTS_KEY = 'blocked_accounts'
const FAILED_ATTEMPTS_KEY = 'login_failed_attempts'

export const RESET_PASSWORD_EMAIL_KEY = 'auth-reset-password-email'

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

type BlockedAccount = {
  identifier: string
  blockedAt: number
  reason: 'max_attempts_exceeded'
}

type FailedAttempt = {
  identifier: string
  count: number
  lastAttempt: number
}

export type AuthenticateResult =
  | { status: 'ok'; user: Omit<MockUser & { password: string }, 'password'> }
  | { status: 'error'; reason: 'email_not_found' | 'invalid_password' | 'account_blocked' }

export type ChangePasswordResult =
  | { status: 'ok' }
  | { status: 'error'; reason: 'invalid_old_password' | 'user_not_found' | 'passwords_dont_match' }

export type ResetPasswordResult =
  | { status: 'ok'; reactivated: boolean }
  | { status: 'error'; reason: 'user_not_found' }

function parseStoredArray<T>(raw: string | null): T[] {
  if (!raw) return []
  try {
    return JSON.parse(raw) as T[]
  } catch {
    return []
  }
}

function normalizeEmail(email: string): string {
  return String(email).trim().toLowerCase()
}

function hasSuspensionState(normalizedEmail: string): boolean {
  const blockedAccounts = parseStoredArray<BlockedAccount>(
    localStorage.getItem(BLOCKED_ACCOUNTS_KEY),
  )
  if (blockedAccounts.some((blocked) => blocked.identifier === normalizedEmail)) {
    return true
  }

  const authUsers = parseStoredArray<AuthLocalUser>(localStorage.getItem(AUTH_USERS_KEY))
  if (
    authUsers.some(
      (user) => normalizeEmail(user.email) === normalizedEmail && String(user.status) === 'suspended',
    )
  ) {
    return true
  }

  const localUsers = parseStoredArray<Array<{ email?: string; status?: string }>[number]>(
    localStorage.getItem(LOCAL_USERS_KEY),
  )
  return localUsers.some(
    (user) => normalizeEmail(String(user.email ?? '')) === normalizedEmail && String(user.status) === 'suspended',
  )
}

function reactivateAccount(normalizedEmail: string): void {
  const blockedAccounts = parseStoredArray<BlockedAccount>(
    localStorage.getItem(BLOCKED_ACCOUNTS_KEY),
  ).filter((blocked) => blocked.identifier !== normalizedEmail)

  if (blockedAccounts.length === 0) {
    localStorage.removeItem(BLOCKED_ACCOUNTS_KEY)
  } else {
    localStorage.setItem(BLOCKED_ACCOUNTS_KEY, JSON.stringify(blockedAccounts))
  }

  const failedAttempts = parseStoredArray<FailedAttempt>(localStorage.getItem(FAILED_ATTEMPTS_KEY)).filter(
    (attempt) => attempt.identifier !== normalizedEmail,
  )
  if (failedAttempts.length === 0) {
    localStorage.removeItem(FAILED_ATTEMPTS_KEY)
  } else {
    localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(failedAttempts))
  }

  const authUsers = parseStoredArray<AuthLocalUser>(localStorage.getItem(AUTH_USERS_KEY))
  let authUsersUpdated = false
  const nextAuthUsers = authUsers.map((user) => {
    if (normalizeEmail(user.email) !== normalizedEmail) return user
    authUsersUpdated = true
    return { ...user, status: 'active' }
  })
  if (authUsersUpdated) {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(nextAuthUsers))
  }

  const localUsers = parseStoredArray<Array<{ email?: string; status?: string }>[number]>(
    localStorage.getItem(LOCAL_USERS_KEY),
  )
  const nextLocalUsers = localUsers.map((user) => {
    if (normalizeEmail(String(user.email ?? '')) !== normalizedEmail) return user
    return { ...user, status: 'active' }
  })
  if (nextLocalUsers.length > 0) {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(nextLocalUsers))
  }
}

export async function authenticate(email: string, password: string): Promise<AuthenticateResult> {
  await sleep(500)

  const normalizedEmail = normalizeEmail(email)
  const storedUsersRaw = localStorage.getItem(AUTH_USERS_KEY)

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

  const normalizedEmail = normalizeEmail(email)
  const storedUsersRaw = localStorage.getItem(AUTH_USERS_KEY)

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
      localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users))

      return { status: 'ok' }
    } catch {
      return { status: 'error', reason: 'user_not_found' }
    }
  }

  // If no stored users, cannot change password for mock users
  return { status: 'error', reason: 'user_not_found' }
}

export async function resetPassword(
  email: string,
  newPassword: string,
): Promise<ResetPasswordResult> {
  await sleep(500)

  const normalizedEmail = normalizeEmail(email)
  const wasSuspended = hasSuspensionState(normalizedEmail)

  const authUsers = parseStoredArray<AuthLocalUser>(localStorage.getItem(AUTH_USERS_KEY))
  const userIndex = authUsers.findIndex(
    (user) => normalizeEmail(String(user.email ?? '')) === normalizedEmail,
  )

  if (userIndex >= 0) {
    authUsers[userIndex] = {
      ...authUsers[userIndex],
      email: normalizedEmail,
      password: newPassword,
      status: 'active',
      role: authUsers[userIndex].role ?? ['general_administrator'],
    }
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(authUsers))
    reactivateAccount(normalizedEmail)
    return { status: 'ok', reactivated: wasSuspended }
  }

  const isMockUser = MOCK_EMAILS.includes(normalizedEmail)
  const localUsers = parseStoredArray<Array<{ email?: string }>[number]>(
    localStorage.getItem(LOCAL_USERS_KEY),
  )
  const isKnownLocalUser = localUsers.some(
    (user) => normalizeEmail(String(user.email ?? '')) === normalizedEmail,
  )

  if (!isMockUser && !isKnownLocalUser) {
    return { status: 'error', reason: 'user_not_found' }
  }

  authUsers.push({
    email: normalizedEmail,
    password: newPassword,
    status: 'active',
    role: ['general_administrator'],
  })
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(authUsers))

  reactivateAccount(normalizedEmail)
  return { status: 'ok', reactivated: wasSuspended }
}
