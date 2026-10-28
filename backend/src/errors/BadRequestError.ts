import { AppError } from './AppError.ts'

export class BadRequestError extends AppError {
  constructor(
    message = 'Bad request',
    code = 'BAD_REQUEST',
    details: unknown = null,
  ) {
    super(message, 400, code, details)
  }
}
