import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Venda, ItemVenda } from '../../services/vendaService';
import type { RootState } from '../store';

export interface VendaState {
  vendas: Venda[];
  filteredVendas: Venda[];
  currentVenda: Venda | null;
  itensVenda: ItemVenda[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  ticketMedio: number;
}

const initialState: VendaState = {
  vendas: [],
  filteredVendas: [],
  currentVenda: null,
  itensVenda: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 50,
  ticketMedio: 0,
};

export const vendaSlice = createSlice({
  name: 'venda',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setVendas: (state, action: PayloadAction<{ data: Venda[]; total: number; page: number }>) => {
      state.vendas = action.payload.data;
      state.filteredVendas = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
    },
    addVenda: (state, action: PayloadAction<Venda>) => {
      state.vendas.push(action.payload);
      state.filteredVendas = state.vendas;
    },
    updateVenda: (state, action: PayloadAction<Venda>) => {
      const index = state.vendas.findIndex((v) => v.id === action.payload.id);
      if (index !== -1) {
        state.vendas[index] = action.payload;
        state.filteredVendas = state.vendas;
      }
    },
    removeVenda: (state, action: PayloadAction<number>) => {
      state.vendas = state.vendas.filter((v) => v.id !== action.payload);
      state.filteredVendas = state.vendas;
    },
    setCurrentVenda: (state, action: PayloadAction<Venda | null>) => {
      state.currentVenda = action.payload;
      if (action.payload) {
        state.itensVenda = action.payload.itens || [];
      }
    },
    setItensVenda: (state, action: PayloadAction<ItemVenda[]>) => {
      state.itensVenda = action.payload;
    },
    addItemVenda: (state, action: PayloadAction<ItemVenda>) => {
      state.itensVenda.push(action.payload);
    },
    removeItemVenda: (state, action: PayloadAction<number>) => {
      state.itensVenda = state.itensVenda.filter((item) => item.id !== action.payload);
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setTicketMedio: (state, action: PayloadAction<number>) => {
      state.ticketMedio = action.payload;
    },
    filterVendas: (state, action: PayloadAction<string>) => {
      const term = action.payload.toLowerCase();
      state.filteredVendas = state.vendas.filter(
        (v) =>
          v.id.toString().includes(term) ||
          v.status.toLowerCase().includes(term) ||
          v.metodoPagamento.toLowerCase().includes(term)
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
  setVendas,
  addVenda,
  updateVenda,
  removeVenda,
  setCurrentVenda,
  setItensVenda,
  addItemVenda,
  removeItemVenda,
  setPage,
  setTicketMedio,
  filterVendas,
  clearError,
} = vendaSlice.actions;

export const selectVendas = (state: RootState) => state.venda.vendas;
export const selectFilteredVendas = (state: RootState) => state.venda.filteredVendas;
export const selectCurrentVenda = (state: RootState) => state.venda.currentVenda;
export const selectItensVenda = (state: RootState) => state.venda.itensVenda;
export const selectVendaLoading = (state: RootState) => state.venda.loading;
export const selectVendaError = (state: RootState) => state.venda.error;
export const selectVendaTotal = (state: RootState) => state.venda.total;
export const selectVendaPage = (state: RootState) => state.venda.page;
export const selectTicketMedio = (state: RootState) => state.venda.ticketMedio;

export default vendaSlice.reducer;
