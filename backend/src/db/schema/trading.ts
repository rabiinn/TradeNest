import {
  pgTable,
  integer,
  text,
  date,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

import { id, fk, cents, createdAt } from './helpers.ts'
import { instruments } from './instruments.ts'
import { users } from './users.ts'
import {
  orderTypeEnum,
  sideEnum,
  timeInForceEnum,
  orderStatusEnum,
} from './enums.ts'
export const orders = pgTable(
  'orders',
  {
    id: id(),
    userId: fk('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    instrumentId: fk('instrument_id')
      .notNull()
      .references(() => instruments.id, { onDelete: 'restrict' }),
    side: sideEnum('side').notNull(),
    orderType: orderTypeEnum('order_type').notNull(),
    timeInForce: timeInForceEnum('time_in_force').notNull().default('DAY'),
    validUntil: date('valid_until'), // only for GTD orders
    quantity: integer('quantity').notNull(),
    limitPrice: cents('limit_price'), // LIMIT and STOP_LIMIT; null otherwise
    stopPrice: cents('stop_price'), // STOP and STOP_LIMIT; null otherwise
    filledQty: integer('filled_qty').notNull().default(0),
    avgPrice: cents('avg_price'),
    status: orderStatusEnum('status').notNull().default('PENDING'),
    rejectReason: text('reject_reason'),
    idempotencyKey: text('idempotency_key'),
    createdAt: createdAt(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('orders_user_created_idx').on(table.userId, table.createdAt),
    index('orders_status_instrument_idx').on(table.status, table.instrumentId),
    uniqueIndex('orders_user_idem_uq').on(table.userId, table.idempotencyKey),
  ],
)

export const trades = pgTable(
  'trades',
  {
    id: id(),
    orderId: fk('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'restrict' }),
    userId: fk('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    instrumentId: fk('instrument_id')
      .notNull()
      .references(() => instruments.id, { onDelete: 'restrict' }),
    side: sideEnum('side').notNull(),
    quantity: integer('quantity').notNull(),
    price: cents('price').notNull(),
    executedAt: timestamp('executed_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index('trades_user_idx').on(table.userId, table.executedAt)],
)
