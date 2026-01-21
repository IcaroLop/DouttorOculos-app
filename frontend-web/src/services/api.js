import axios from 'axios';
import { store } from '../redux/store';
import { logout, setAuth, updateTokens } from '../redux/slices/authSlice';
import { refreshToken } from './auth';
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});
function getCurrentAuth() {
    const state = store.getState().auth;
    return state;
}
api.interceptors.request.use((config) => {
    const portal = localStorage.getItem('portal') || getCurrentAuth().portal;
    if (portal) {
        config.headers['x-portal'] = portal;
    }
    const token = getCurrentAuth().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
let refreshInFlight = null;
async function ensureRefreshedToken() {
    if (refreshInFlight)
        return refreshInFlight;
    const { refreshToken: storedRefresh, portal, user } = getCurrentAuth();
    if (!storedRefresh || !portal) {
        store.dispatch(logout());
        return null;
    }
    refreshInFlight = refreshToken({ refreshToken: storedRefresh, portal })
        .then((res) => {
        const nextAccess = res.accessToken;
        const nextRefresh = res.refreshToken ?? storedRefresh;
        if (user) {
            store.dispatch(setAuth({ accessToken: nextAccess, refreshToken: nextRefresh, portal, user }));
        }
        else {
            store.dispatch(updateTokens({ accessToken: nextAccess, refreshToken: nextRefresh }));
        }
        return nextAccess;
    })
        .catch((err) => {
        console.warn('Refresh token falhou', err);
        store.dispatch(logout());
        return null;
    })
        .finally(() => {
        refreshInFlight = null;
    });
    return refreshInFlight;
}
api.interceptors.response.use((response) => response, async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;
    if (status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true;
        const newToken = await ensureRefreshedToken();
        if (newToken) {
            originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${newToken}`,
            };
            return api(originalRequest);
        }
    }
    return Promise.reject(error);
});
export default api;
