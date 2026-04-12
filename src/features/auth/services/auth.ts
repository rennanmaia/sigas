import { sleep } from '@/lib/utils'

type MockUser = {
  cpf: string
  email: string
  role: string[]
}
export type AuthenticateResult =
  | { status: 'ok'; user: Omit<MockUser & { password: string }, 'password'> }
  | { status: 'error'; reason: 'cpf_not_found' | 'invalid_password' | 'account_blocked' }

export async function authenticate(cpf: string, password: string): Promise<AuthenticateResult> {
  await sleep(500)

  const normalizedCpf = cpf.replace(/\D/g, '')
  const storedUsersRaw = localStorage.getItem('local-users')
  if (storedUsersRaw) {
    try {
      const users = JSON.parse(storedUsersRaw) as Array<{ cpf?: string; status?: string }>
      const matched = users.find((user) => String(user.cpf ?? '').replace(/\D/g, '') === normalizedCpf)
      if (matched && ['inactive', 'suspended'].includes(String(matched.status))) {
        return { status: 'error', reason: 'account_blocked' }
      }
    } catch {
      // Keep auth flow resilient if local users cache is malformed.
    }
  }

//   const found = mockUsers.find((u) => u.cpf === cpf)
//   if (!found) return { status: 'error', reason: 'cpf_not_found' }

//   if (found.password !== password) return { status: 'error', reason: 'invalid_password' }
  if (!password) return { status: 'error', reason: 'invalid_password' }

//   const { password: _p, ...rest } = found
  return { 
    status: 'ok', 
    user: {
        cpf,
        email: 'user@sigas.com',
        role: ['general_administrator'],
    }
  }
}
