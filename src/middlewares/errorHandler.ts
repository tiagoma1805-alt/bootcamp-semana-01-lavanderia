import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'fail',
      message: 'Error de validación en la petición',
      issues: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (err instanceof AppError) {
    logger.warn(`[AppError ${err.statusCode}]: ${err.message}`);
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  logger.error(`[Unhandled Error]: ${err.stack || err.message}`);
  return res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
  });
};