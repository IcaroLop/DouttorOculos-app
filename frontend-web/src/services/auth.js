import api from './api';
export async function login(payload) {
    const response = await api.post('/api/v1/auth/login', payload);
    return response.data;
}
export async function refreshToken(payload) {
    const response = await api.post('/api/v1/auth/refresh', payload);
    return response.data;
}
