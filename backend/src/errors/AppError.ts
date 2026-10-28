// Base class for every error we throw on purpose
// Services throw these, error-handling middleware turns them into HTTP responses
// - statusCode: the HTTP status to send
// - code: a

export class AppError extends Error {
  readonly statusCode: number
  readonly code: string
  readonly details?: unknown

  constructor(
    message: string,
    statusCode: number = 500,
    code: string,
    details: unknown = null,
  ) {
    super(message)
    this.name = new.target.name
    this.statusCode = statusCode
    this.code = code
    this.details = details
    Error.captureStackTrace?.(this, new.target)
  }
}
