import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

interface ValidationSchemas {
  body?: z.ZodType;
  params?: z.ZodType;
}

export function validate(schemas: ValidationSchemas) {
  return (request: Request, response: Response, next: NextFunction): void => {
    if (schemas.body) {
      const result = schemas.body.safeParse(request.body);
      if (!result.success) {
        response.status(400).json({ message: 'Invalid request data.', errors: result.error.flatten().fieldErrors });
        return;
      }
      request.body = result.data;
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(request.params);
      if (!result.success) {
        response.status(400).json({ message: 'Invalid request params.', errors: result.error.flatten().fieldErrors });
        return;
      }
      request.params = result.data as Record<string, string>;
    }

    next();
  };
}
