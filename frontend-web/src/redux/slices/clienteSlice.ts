import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cliente } from '../../services/clienteService';
import type { RootState } from '../store';

export interface ClienteState {
  clientes: Cliente[];
  filteredClientes: Cliente[];
  currentCliente: Cliente | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: ClienteState = {
  clientes: [],
  filteredClientes: [],
  currentCliente: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 50,
};

export const clienteSlice = createSlice({
  name: 'cliente',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setClientes: (state, action: PayloadAction<{ data: Cliente[]; total: number; page: number }>) => {
      state.clientes = action.payload.data;
      state.filteredClientes = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
    },
    addCliente: (state, action: PayloadAction<Cliente>) => {
      state.clientes.push(action.payload);
      state.filteredClientes = state.clientes;
    },
    updateCliente: (state, action: PayloadAction<Cliente>) => {
      const index = state.clientes.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.clientes[index] = action.payload;
        state.filteredClientes = state.clientes;
      }
    },
    removeCliente: (state, action: PayloadAction<number>) => {
      state.clientes = state.clientes.filter((c) => c.id !== action.payload);
      state.filteredClientes = state.clientes;
    },
    setCurrentCliente: (state, action: PayloadAction<Cliente | null>) => {
      state.currentCliente = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    filterClientes: (state, action: PayloadAction<string>) => {
      const term = action.payload.toLowerCase();
      state.filteredClientes = state.clientes.filter(
        (c) =>
          c.nome.toLowerCase().includes(term) ||
          c.cpf.includes(term) ||
          c.telefone.includes(term) ||
          (c.email && c.email.toLowerCase().includes(term))
      );
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setClientes,
  addCliente,
  updateCliente,
  removeCliente,
  setCurrentCliente,
  setPage,
  filterClientes,
  clearError,
} = clienteSlice.actions;

export const selectClientes = (state: RootState) => state.cliente.clientes;
export const selectFilteredClientes = (state: RootState) => state.cliente.filteredClientes;
export const selectCurrentCliente = (state: RootState) => state.cliente.currentCliente;
export const selectClienteLoading = (state: RootState) => state.cliente.loading;
export const selectClienteError = (state: RootState) => state.cliente.error;
export const selectClienteTotal = (state: RootState) => state.cliente.total;
export const selectClientePage = (state: RootState) => state.cliente.page;

export default clienteSlice.reducer;
