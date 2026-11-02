import type { LoginInput, RegisterInput } from './users.schemas.ts'
import { db } from '../db/connection.ts'
import { users } from '../db/schema/users.ts'
import { eq } from 'drizzle-orm'
import { ConflictError } from '../errors/ConflictError.ts'
import { NotFoundError } from '../errors/NotFoundError.ts'
import { hashPassword, verifyPassword } from '../utils/password.ts'
import { generateToken, verifyToken } from '../utils/jwt.ts'
import { toUserResponse } from './users.mapper.ts'
import { UnauthorizedError } from '../errors/UnauthorizedError.ts'

export const registerUser = async (credentials: RegisterInput) => {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, credentials.email))

  if (existingUser) {
    throw new ConflictError('User with the email already exists')
  }
  const hashedPassword = await hashPassword(credentials.password)
  const [newUser] = await db
    .insert(users)
    .values({ ...credentials, passwordHash: hashedPassword })
    .returning()

  return toUserResponse(newUser)
}

export async function issueTokens(
  userId: string,
  opts: {
    userAgent?: string | null
    familyId?: string
    sessionStartedAt?: Date
  },
) {}

export const loginUser = async (credentials: LoginInput) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, credentials.email))
  if (!user) {
    throw new NotFoundError('User not found')
  }

  const passwordMatches = await verifyPassword(
    credentials.password,
    user.passwordHash,
  )
  if (!passwordMatches) {
    throw new UnauthorizedError('Email or password is wrong')
  }
}
