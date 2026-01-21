import api from './api';
import type { LoginPayload, LoginResponse, RefreshPayload, RefreshResponse } from '../types/auth';

export async function login(payload: LoginPayload) {
  const response = await api.post<LoginResponse>('/api/v1/auth/login', payload);
  return response.data;
}

export async function refreshToken(payload: RefreshPayload) {
  const response = await api.post<RefreshResponse>('/api/v1/auth/refresh', payload);
  return response.data;
}
