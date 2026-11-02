import type { LoginInput, RegisterInput } from './users.schemas.ts'
import { db } from '../db/connection.ts'
import { refreshTokens, users } from '../db/schema/users.ts'
import { and, eq, gt, isNull } from 'drizzle-orm'
import { ConflictError } from '../errors/ConflictError.ts'
import { NotFoundError } from '../errors/NotFoundError.ts'
import { hashPassword, verifyPassword } from '../utils/password.ts'
import { generateToken } from '../utils/jwt.ts'
import { toUserResponse } from './users.mapper.ts'
import { UnauthorizedError } from '../errors/UnauthorizedError.ts'
import {
  generateRefreshToken,
  hashRefreshToken,
} from '../utils/refresh.tokens.ts'

export const registerUser = async (credentials: RegisterInput) => {
  const hashedPassword = await hashPassword(credentials.password)
  const [newUser] = await db
    .insert(users)
    .values({ ...credentials, passwordHash: hashedPassword })
    .onConflictDoNothing({ target: users.email })
    .returning()

  if (!newUser) {
    throw new ConflictError('User with the email already exists')
  }

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
  const user = await db.query.users.findFirst({
    where: eq(users.email, credentials.email),
  })
  if (!user) {
    throw new NotFoundError('User not found')
  }

  const passwordMatches = await verifyPassword(
    credentials.password,
    user.passwordHash,
  )
  if (!passwordMatches || user.status !== 'ACTIVE') {
    throw new UnauthorizedError('Email or password is wrong')
  }
  const accessToken = await generateToken({ id: user.id, email: user.email })

  const refreshToken = generateRefreshToken()

  await db.insert(refreshTokens).values({
    userId: user.id,
    tokenHash: refreshToken.hash,
    userAgent: credentials.userAgent,
    expiresAt: refreshToken.expiresAt,
  })

  return { user: toUserResponse(user), accessToken, refreshToken }
}

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

const revokeFamily = (tx: Transaction, familyId: string, now: Date) => {
  return tx
    .update(refreshTokens)
    .set({ revokedAt: now })
    .where(
      and(
        eq(refreshTokens.familyId, familyId),
        isNull(refreshTokens.revokedAt),
      ),
    )
}

export const refreshSession = async (
  currentToken: string,
  userAgent?: string,
) => {
  const currentHash = hashRefreshToken(currentToken)
  const now = new Date()

  const result = await db.transaction(async (tx) => {
    // Atomically void the token if it's still valid
    const [claimed] = await tx
      .update(refreshTokens)
      .set({
        revokedAt: now,
      })
      .where(
        and(
          eq(refreshTokens.tokenHash, currentHash),
          isNull(refreshTokens.revokedAt),
          gt(refreshTokens.expiresAt, now),
        ),
      )
      .returning({
        userId: refreshTokens.userId,
        familyId: refreshTokens.familyId,
      })

    // Handle invalid, expired or reused tokens
    if (!claimed) {
      const [existing] = await tx
        .select({
          familyId: refreshTokens.familyId,
          revokedAt: refreshTokens.revokedAt,
        })
        .from(refreshTokens)
        .where(eq(refreshTokens.tokenHash, currentHash))
        .limit(1)

      // A revoked token was presented again, treat it as reuse
      if (existing?.revokedAt) {
        await revokeFamily(tx, existing.familyId, now)
      }

      return null
    }
    // Verify the user still exists and is active
    const [user] = await tx
      .select()
      .from(users)
      .where(eq(users.id, claimed.userId))
      .limit(1)

    if (!user || user.status !== 'ACTIVE') {
      await revokeFamily(tx, claimed.familyId, now)
      return null
    }
    // Generate next replacement tokens
    const accessToken = await generateToken({
      id: user.id,
      email: user.email,
    })
    const next = generateRefreshToken()
    // Store the new refresh token
    await tx.insert(refreshTokens).values({
      userId: user.id,
      familyId: claimed.familyId,
      tokenHash: next.hash,
      userAgent,
      expiresAt: next.expiresAt,
    })

    return {
      accessToken,
      refreshToken: next.token,
      expiresAt: next.expiresAt,
    }
  })

  if (!result) {
    throw new UnauthorizedError()
  }
  return result
}
