import bcrypt from 'bcryptjs';
import env from '../config/env';

export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(env.auth.bcryptRounds);
  return bcrypt.hash(plain, salt);
}

export async function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
