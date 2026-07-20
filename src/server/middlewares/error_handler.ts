import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Backend Exception:", err);

  const status = err.statusCode || 500;
  const message = err.message || "An unexpected error occurred in our pipeline.";

  res.status(status).json({
    status: "Error",
    statusCode: status,
    message,
    errors: err.errors || undefined,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};
