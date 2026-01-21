import { Request, Response, NextFunction } from 'express';
import { loginService } from '../services/authService';

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loginService(req.body);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}
