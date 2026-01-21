import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Produto } from '../../services/produtoService';
import type { RootState } from '../store';

export interface ProdutoState {
  produtos: Produto[];
  filteredProdutos: Produto[];
  currentProduto: Produto | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  categoriaSelecionada?: string;
}

const initialState: ProdutoState = {
  produtos: [],
  filteredProdutos: [],
  currentProduto: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 50,
};

export const produtoSlice = createSlice({
  name: 'produto',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProdutos: (state, action: PayloadAction<{ data: Produto[]; total: number; page: number }>) => {
      state.produtos = action.payload.data;
      state.filteredProdutos = action.payload.data;
      state.total = action.payload.total;
      state.page = action.payload.page;
    },
    addProduto: (state, action: PayloadAction<Produto>) => {
      state.produtos.push(action.payload);
      state.filteredProdutos = state.produtos;
    },
    updateProduto: (state, action: PayloadAction<Produto>) => {
      const index = state.produtos.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.produtos[index] = action.payload;
        state.filteredProdutos = state.produtos;
      }
    },
    removeProduto: (state, action: PayloadAction<number>) => {
      state.produtos = state.produtos.filter((p) => p.id !== action.payload);
      state.filteredProdutos = state.produtos;
    },
    setCurrentProduto: (state, action: PayloadAction<Produto | null>) => {
      state.currentProduto = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setCategoriaSelecionada: (state, action: PayloadAction<string | undefined>) => {
      state.categoriaSelecionada = action.payload;
    },
    filterProdutos: (state, action: PayloadAction<string>) => {
      const term = action.payload.toLowerCase();
      state.filteredProdutos = state.produtos.filter(
        (p) =>
          p.nome.toLowerCase().includes(term) ||
          p.codigoSku.toLowerCase().includes(term) ||
          (p.descricao && p.descricao.toLowerCase().includes(term))
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
  setProdutos,
  addProduto,
  updateProduto,
  removeProduto,
  setCurrentProduto,
  setPage,
  setCategoriaSelecionada,
  filterProdutos,
  clearError,
} = produtoSlice.actions;

export const selectProdutos = (state: RootState) => state.produto.produtos;
export const selectFilteredProdutos = (state: RootState) => state.produto.filteredProdutos;
export const selectCurrentProduto = (state: RootState) => state.produto.currentProduto;
export const selectProdutoLoading = (state: RootState) => state.produto.loading;
export const selectProdutoError = (state: RootState) => state.produto.error;
export const selectProdutoTotal = (state: RootState) => state.produto.total;
export const selectProdutoPage = (state: RootState) => state.produto.page;
export const selectCategoriaSelecionada = (state: RootState) => state.produto.categoriaSelecionada;

export default produtoSlice.reducer;
