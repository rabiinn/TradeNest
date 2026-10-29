import type { ErrorRequestHandler } from 'express'
import { AppError } from '../errors/AppError.ts'
import { ZodError } from 'zod'

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Errors we threw on purpose
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      details: err.details,
    })
  }

  // ZodError
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'ZOD_VALIDATION_FAILED',
      details: err.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    })
  }
  // Other errors
  return res.status(500).json({
    error: 'Something went wrong',
    code: 'INTERNAL_ERROR',
  })
}
