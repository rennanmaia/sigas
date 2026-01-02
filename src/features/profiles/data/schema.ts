import { z } from 'zod'

const profileSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
  description: z.string().optional(),
  permissions: z.number().optional().catch(0),
})
export type Profile = z.infer<typeof profileSchema>
export const profileListSchema = z.array(profileSchema)
