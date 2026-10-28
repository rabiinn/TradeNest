import z from 'zod'

export const USER_STATUSES = ['ACTIVE', 'DISABLED'] as const
export const registerBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
  status: z.enum(USER_STATUSES),
})

export const loginUserSchema = z.object({
  email: z.string(),
  password: z.string(),
})

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  status: z.enum(USER_STATUSES),
  createdAt: z.string(),
})

export type RegisterBody = z.infer<typeof registerBodySchema>
export type UserResponse = z.infer<typeof userResponseSchema>
