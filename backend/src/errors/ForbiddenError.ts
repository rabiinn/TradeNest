import { AppError } from './AppError.ts'

export class ForbiddenError extends AppError {
  constructor(
    message = 'Forbidden',
    code = 'FORBIDDEN',
    details: unknown = null,
  ) {
    super(message, 403, code, details)
  }
}
