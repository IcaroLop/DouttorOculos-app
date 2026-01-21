import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export type AuthUser = {
  id: number;
  nome: string;
  email: string;
  cargo: string;
};

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  portal: string | null;
  user: AuthUser | null;
};

export type AuthPayload = {
  accessToken: string;
  refreshToken?: string | null;
  portal: string;
  user: AuthUser;
};

export type TokenUpdatePayload = {
  accessToken: string;
  refreshToken?: string | null;
};

const STORAGE_KEY = 'authState';

function loadPersistedState(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { accessToken: null, refreshToken: null, portal: null, user: null };
    const parsed = JSON.parse(raw) as AuthState;
    return {
      accessToken: parsed.accessToken || null,
      refreshToken: parsed.refreshToken || null,
      portal: parsed.portal || null,
      user: parsed.user || null,
    };
  } catch (err) {
    console.warn('Falha ao carregar auth do storage', err);
    return { accessToken: null, refreshToken: null, portal: null, user: null };
  }
}

function persistState(state: AuthState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (state.portal) {
      localStorage.setItem('portal', state.portal);
    }
  } catch (err) {
    console.warn('Falha ao salvar auth no storage', err);
  }
}

const initialState: AuthState = loadPersistedState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<AuthPayload>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken ?? null;
      state.portal = action.payload.portal;
      state.user = action.payload.user;
      persistState(state);
    },
    updateTokens(state, action: PayloadAction<TokenUpdatePayload>) {
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
      } catch (err) {
        console.warn('Falha ao limpar auth do storage', err);
      }
    },
  },
});

export const { setAuth, updateTokens, logout } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.accessToken);

export default authSlice.reducer;
