import { pgTable, text, jsonb } from 'drizzle-orm/pg-core'
import { id, fk, createdAt } from './helpers.ts'
import { users } from './users.ts'

export const auditLog = pgTable('audit_log', {
  id: id(),
  userId: fk('user_id').references(() => users.id),
  action: text('action').notNull(),
  entity: text('entity'),
  entityId: fk('entity_id'),
  payload: jsonb('payload'),
  ip: text('ip'),
  createdAt: createdAt(),
})
