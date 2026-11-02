import { randomBytes, createHash } from 'node:crypto'
import { env } from '../../env.ts'

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function generateRefreshToken() {
  const token = randomBytes(32).toString('base64url')
  return {
    token,
    hash: hashRefreshToken(token),
    expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_IN),
  }
}
