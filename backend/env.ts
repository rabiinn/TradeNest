import { z, ZodError } from 'zod'
import dotenv from 'dotenv'

process.env.APP_STAGE = process.env.APP_STAGE || 'dev'

const isDevelopment = process.env.APP_STAGE === 'dev'
const isTesting = process.env.APP_STAGE === 'test'
const isProduction = process.env.APP_STAGE === 'production'

if (isDevelopment) {
  dotenv.config({ path: './.env.dev', override: true })
} else if (isProduction) {
  dotenv.config({ path: './.env', override: true })
} else if (isTesting) {
  dotenv.config({ path: './.env.test', override: true })
}
const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(['DEVELOPMENT', 'TEST', 'PRODUCTION'])
    .default('DEVELOPMENT'),

  // Server
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('localhost'),

  // Database

  DATABASE_URL: z.string().startsWith('postgresql://'),
  DATABASE_POOL_MIN: z.coerce.number().min(0).default(2),
  DATABASE_POOL_MAX: z.coerce.number().positive().default(10),

  // JWT & Auth
  JWT_SECRET: z.string().min(32, 'JWT secret must be 32 character long'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REFRESH_TOKEN_SECRET: z.string().min(32).optional(),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),

  BCRYPT_SALT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
  CORS_ORIGIN: z.string(),
})

export type Env = z.infer<typeof envSchema>

let env: Env

try {
  env = envSchema.parse(process.env)
} catch (error) {
  if (error instanceof ZodError) {
    // Print out the error on console
    console.error('Invalid environment variables')
    console.error(JSON.stringify(z.treeifyError(error)))
  }
}

export const isProd = () => env.NODE_ENV === 'PRODUCTION'
export const isDev = () => env.NODE_ENV === 'DEVELOPMENT'
export const isTestEnv = () => env.NODE_ENV === 'TEST'

export { env }
