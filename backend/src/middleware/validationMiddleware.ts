import type { NextFunction, Request, Response } from 'express'
import { ZodType } from 'zod'

export const validateBody = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return next(result.error)
    }
    req.body = result.data
    next()
  }
}

export const validateQuery = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      return next(result.error)
    }
    next()
  }
}

export const validateParams = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params)
    if (!result.success) {
      return next(result.error)
    }
    next()
  }
}
