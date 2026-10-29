import { createSecretKey } from 'crypto'
import { env } from '../../env.ts'
import { jwtVerify, SignJWT, type JWTPayload } from 'jose'
import z from 'zod'

export const JWTPayloadSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  email: z.email('Invalid email address'),
})

export type GenerateTokenPayload = z.infer<typeof JWTPayloadSchema>
export type CustomJwtPayload = GenerateTokenPayload & JWTPayload

const secret = process.env.JWT_SECRET
if (!secret) {
  throw new Error('JWT_SECRET environment variable is not set')
}
export const secretKey = createSecretKey(secret, 'utf-8')

export const generateToken = async (payload: GenerateTokenPayload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN || '7d')
    .sign(secretKey)
}

export const verifyToken = async (token: string): Promise<CustomJwtPayload> => {
  const { payload } = await jwtVerify(token, secretKey)

  const validatedPayload = JWTPayloadSchema.parse(payload)
  return validatedPayload
}
