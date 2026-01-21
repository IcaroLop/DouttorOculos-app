import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';

export function validateBody(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ message: 'Dados inválidos', details: error.details });
    }
    req.body = value;
    return next();
  };
}
