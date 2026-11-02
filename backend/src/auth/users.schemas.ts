import z from 'zod'

export const USER_STATUSES = ['ACTIVE', 'DISABLED'] as const
export const registerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email().trim().toLowerCase().max(254),
  password: z
    .string()
    .min(10, 'Password must be at least 10 character')
    .max(128),
  status: z.enum(USER_STATUSES).optional(),
})

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(128),
  userAgent: z.string().optional(),
})

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  status: z.enum(USER_STATUSES),
  createdAt: z.string(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UserResponse = z.infer<typeof userResponseSchema>

export type LoginResponse = {
  user: UserResponse
  accessToken: string
}
