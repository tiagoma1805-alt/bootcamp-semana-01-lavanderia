import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (err instanceof AppError) {
    logger.warn(`AppError (${err.statusCode}): ${err.message}`);
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  logger.error(`Unhandled Error: ${err.stack || err.message}`);
  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Error interno del servidor',
  });
};