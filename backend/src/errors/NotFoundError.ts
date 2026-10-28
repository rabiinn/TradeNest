import { AppError } from './AppError.ts'

export class NotFoundError extends AppError {
  constructor(
    message = 'Not found',
    code = 'NOT_FOUND',
    details: unknown = null,
  ) {
    super(message, 404, code, details)
  }
}
