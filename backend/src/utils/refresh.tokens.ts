import { randomBytes, createHash } from 'node:crypto'

const DAY_MS = 24 * 60 * 60 * 1000

export const REFRESH_COOKIE_NAME = 'refresh_token'

export const REFRESH_TTL_MS = 7 * DAY_MS // idle timeout: resets on every rotation
export const SESSION_MAX_MS = 30 * DAY_MS // absolute limit: enforced later, in /auth/refresh

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function generateRefreshToken() {
  const token = randomBytes(32).toString('base64url')
  return {
    token,
    hash: hashRefreshToken(token),
  }
}
