import { AppError } from './AppError.ts'

export class UnauthorizedError extends AppError {
  constructor(
    message = 'Unauthorized',
    code = 'UNAUTHORIZED',
    details: unknown = null,
  ) {
    super(message, 401, code, details)
  }
}
