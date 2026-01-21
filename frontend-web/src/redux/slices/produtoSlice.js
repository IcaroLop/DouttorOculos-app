import { createSlice } from '@reduxjs/toolkit';
const initialState = {
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
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setProdutos: (state, action) => {
            state.produtos = action.payload.data;
            state.filteredProdutos = action.payload.data;
            state.total = action.payload.total;
            state.page = action.payload.page;
        },
        addProduto: (state, action) => {
            state.produtos.push(action.payload);
            state.filteredProdutos = state.produtos;
        },
        updateProduto: (state, action) => {
            const index = state.produtos.findIndex((p) => p.id === action.payload.id);
            if (index !== -1) {
                state.produtos[index] = action.payload;
                state.filteredProdutos = state.produtos;
            }
        },
        removeProduto: (state, action) => {
            state.produtos = state.produtos.filter((p) => p.id !== action.payload);
            state.filteredProdutos = state.produtos;
        },
        setCurrentProduto: (state, action) => {
            state.currentProduto = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setCategoriaSelecionada: (state, action) => {
            state.categoriaSelecionada = action.payload;
        },
        filterProdutos: (state, action) => {
            const term = action.payload.toLowerCase();
            state.filteredProdutos = state.produtos.filter((p) => p.nome.toLowerCase().includes(term) ||
                p.codigoSku.toLowerCase().includes(term) ||
                (p.descricao && p.descricao.toLowerCase().includes(term)));
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});
export const { setLoading, setError, setProdutos, addProduto, updateProduto, removeProduto, setCurrentProduto, setPage, setCategoriaSelecionada, filterProdutos, clearError, } = produtoSlice.actions;
export const selectProdutos = (state) => state.produto.produtos;
export const selectFilteredProdutos = (state) => state.produto.filteredProdutos;
export const selectCurrentProduto = (state) => state.produto.currentProduto;
export const selectProdutoLoading = (state) => state.produto.loading;
export const selectProdutoError = (state) => state.produto.error;
export const selectProdutoTotal = (state) => state.produto.total;
export const selectProdutoPage = (state) => state.produto.page;
export const selectCategoriaSelecionada = (state) => state.produto.categoriaSelecionada;
export default produtoSlice.reducer;
