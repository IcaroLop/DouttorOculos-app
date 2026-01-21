import { createSlice } from '@reduxjs/toolkit';
const STORAGE_KEY = 'authState';
function loadPersistedState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return { accessToken: null, refreshToken: null, portal: null, user: null };
        const parsed = JSON.parse(raw);
        return {
            accessToken: parsed.accessToken || null,
            refreshToken: parsed.refreshToken || null,
            portal: parsed.portal || null,
            user: parsed.user || null,
        };
    }
    catch (err) {
        console.warn('Falha ao carregar auth do storage', err);
        return { accessToken: null, refreshToken: null, portal: null, user: null };
    }
}
function persistState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        if (state.portal) {
            localStorage.setItem('portal', state.portal);
        }
    }
    catch (err) {
        console.warn('Falha ao salvar auth no storage', err);
    }
}
const initialState = loadPersistedState();
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action) {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken ?? null;
            state.portal = action.payload.portal;
            state.user = action.payload.user;
            persistState(state);
        },
        updateTokens(state, action) {
            state.accessToken = action.payload.accessToken;
            if (action.payload.refreshToken !== undefined) {
                state.refreshToken = action.payload.refreshToken;
            }
            persistState(state);
        },
        logout(state) {
            state.accessToken = null;
            state.refreshToken = null;
            state.portal = null;
            state.user = null;
            try {
                localStorage.removeItem(STORAGE_KEY);
            }
            catch (err) {
                console.warn('Falha ao limpar auth do storage', err);
            }
        },
    },
});
export const { setAuth, updateTokens, logout } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => Boolean(state.auth.accessToken);
export default authSlice.reducer;
