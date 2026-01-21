import { Router } from 'express';
import Joi from 'joi';
import { loginController } from '../controllers/authController';
import { validateBody } from '../middleware/validateBody';

const router = Router();

const loginSchema = Joi.object({
  portal: Joi.string().trim().min(1).max(100).required(),
  username: Joi.string().trim().min(3).max(100).required(),
  password: Joi.string().min(3).max(128).required(),
});

router.post('/login', validateBody(loginSchema), loginController);

export default router;
