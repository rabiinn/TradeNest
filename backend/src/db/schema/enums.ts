import { pgEnum } from 'drizzle-orm/pg-core'
export const sideEnum = pgEnum('side', ['BUY', 'SELL'])
export const orderTypeEnum = pgEnum('order_type', [
  'MARKET',
  'LIMIT',
  'STOP',
  'STOP_LIMIT',
])
export const timeInForceEnum = pgEnum('time_in_force', ['DAY', 'GTD', 'GTC'])
export const orderStatusEnum = pgEnum('order_status', [
  'PENDING',
  'OPEN',
  'PARTIAL',
  'COMPLETE',
  'CANCELLED',
  'REJECTED',
  'EXPIRED',
])
export const instrumentTypeEnum = pgEnum('instrument_type', ['STOCK', 'ETF'])
export const ledgerTypeEnum = pgEnum('ledger_type', [
  'CREDIT',
  'DEBIT',
  'HOLD',
  'RELEASE',
])
export const intervalEnum = pgEnum('candle_interval', ['1m', '5m', '15m', '1d'])
