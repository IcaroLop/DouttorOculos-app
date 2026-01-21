import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { AppDataSource } from '../config/data-source';
import { comparePassword, hashPassword } from '../utils/password';
import env from '../config/env';
import jwt, { SignOptions } from 'jsonwebtoken';

export type LoginInput = {
  portal: string;
  username: string;
  password: string;
};

const userRepo = (): Repository<User> => AppDataSource.getRepository(User);

export async function ensureAdminUser() {
  const repo = userRepo();
  const portal = env.admin.portal;
  const username = env.admin.username;

  const existing = await repo.findOne({ where: { portal, username } });
  if (existing) return existing;

  const admin = repo.create({
    portal,
    username,
    email: env.admin.email,
    nome: 'Administrador',
    cargo: 'admin',
    ativo: true,
    lojaId: null,
    senhaHash: await hashPassword(env.admin.password),
  });

  return repo.save(admin);
}

export async function loginService(input: LoginInput) {
  const repo = userRepo();
  const user = await repo.findOne({ where: { portal: input.portal, username: input.username, ativo: true } });

  if (!user) {
    const error: any = new Error('Usuário ou senha inválidos.');
    error.status = 401;
    throw error;
  }

  const valid = await comparePassword(input.password, user.senhaHash);
  if (!valid) {
    const error: any = new Error('Usuário ou senha inválidos.');
    error.status = 401;
    throw error;
  }

  const accessOptions: SignOptions = { expiresIn: env.auth.jwtExpiresIn as any };
  const accessToken = jwt.sign(
    { sub: user.id, portal: user.portal, cargo: user.cargo },
    env.auth.jwtSecret,
    accessOptions
  );

  const refreshOptions: SignOptions = { expiresIn: env.auth.refreshExpiresIn as any };
  const refreshToken = jwt.sign(
    { sub: user.id, portal: user.portal },
    env.auth.refreshSecret,
    refreshOptions
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      cargo: user.cargo,
      portal: user.portal,
    },
  };
}
