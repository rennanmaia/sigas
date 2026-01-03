import { sleep } from '@/lib/utils'

type MockUser = {
  cpf: string
  email: string
  role: string[]
}
export type AuthenticateResult =
  | { status: 'ok'; user: Omit<MockUser & { password: string }, 'password'> }
  | { status: 'error'; reason: 'cpf_not_found' | 'invalid_password' }

export async function authenticate(cpf: string, password: string): Promise<AuthenticateResult> {
  await sleep(500)

//   const found = mockUsers.find((u) => u.cpf === cpf)
//   if (!found) return { status: 'error', reason: 'cpf_not_found' }

//   if (found.password !== password) return { status: 'error', reason: 'invalid_password' }

//   const { password: _p, ...rest } = found
  return { 
    status: 'ok', 
    user: {
        cpf,
        email: 'user@sigas.com',
        role: ['user'],
    }
  }
}
