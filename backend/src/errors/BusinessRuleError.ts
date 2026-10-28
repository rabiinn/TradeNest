import { AppError } from './AppError.ts'

export class BusinessRuleError extends AppError {
  constructor(
    message = 'Business rule violation',
    code = 'BUSINESS_RULE_VIOLATION',
    details: unknown = null,
  ) {
    super(message, 400, code, details)
  }
}
