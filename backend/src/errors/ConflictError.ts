import { AppError } from './AppError.ts'

export class ConflictError extends AppError {
  constructor(
    message = 'Conflict',
    code = 'CONFLICT',
    details: unknown = null,
  ) {
    super(message, 409, code, details)
  }
}
