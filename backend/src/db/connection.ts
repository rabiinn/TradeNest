import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { remember } from '@epic-web/remember'
import { env, isProd } from '../../env.ts'
import * as schema from './schema/index.ts'
export const createPool = () => {
  return new Pool({
    connectionString: env.DATABASE_URL,
    min: env.DATABASE_POOL_MIN,
    max: env.DATABASE_POOL_MAX,
  })
}

let client

if (isProd()) {
  client = createPool()
} else {
  client = remember('dbPool', () => createPool())
}
export const db = drizzle({ client, schema })
