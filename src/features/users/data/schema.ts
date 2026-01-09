import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('general_administrator'),
  z.literal('project_administrator'),
  z.literal('questionnaire_administrator'),
  z.literal('collector'),
])

const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  cpf: z.string().optional(),
  email: z.string(),
  phoneNumber: z.string(),
  status: userStatusSchema,
  roles: z.array(userRoleSchema),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
