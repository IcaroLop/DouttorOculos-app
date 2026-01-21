import { createSlice } from '@reduxjs/toolkit';
const initialState = {
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
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setVendas: (state, action) => {
            state.vendas = action.payload.data;
            state.filteredVendas = action.payload.data;
            state.total = action.payload.total;
            state.page = action.payload.page;
        },
        addVenda: (state, action) => {
            state.vendas.push(action.payload);
            state.filteredVendas = state.vendas;
        },
        updateVenda: (state, action) => {
            const index = state.vendas.findIndex((v) => v.id === action.payload.id);
            if (index !== -1) {
                state.vendas[index] = action.payload;
                state.filteredVendas = state.vendas;
            }
        },
        removeVenda: (state, action) => {
            state.vendas = state.vendas.filter((v) => v.id !== action.payload);
            state.filteredVendas = state.vendas;
        },
        setCurrentVenda: (state, action) => {
            state.currentVenda = action.payload;
            if (action.payload) {
                state.itensVenda = action.payload.itens || [];
            }
        },
        setItensVenda: (state, action) => {
            state.itensVenda = action.payload;
        },
        addItemVenda: (state, action) => {
            state.itensVenda.push(action.payload);
        },
        removeItemVenda: (state, action) => {
            state.itensVenda = state.itensVenda.filter((item) => item.id !== action.payload);
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setTicketMedio: (state, action) => {
            state.ticketMedio = action.payload;
        },
        filterVendas: (state, action) => {
            const term = action.payload.toLowerCase();
            state.filteredVendas = state.vendas.filter((v) => v.id.toString().includes(term) ||
                v.status.toLowerCase().includes(term) ||
                v.metodoPagamento.toLowerCase().includes(term));
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});
export const { setLoading, setError, setVendas, addVenda, updateVenda, removeVenda, setCurrentVenda, setItensVenda, addItemVenda, removeItemVenda, setPage, setTicketMedio, filterVendas, clearError, } = vendaSlice.actions;
export const selectVendas = (state) => state.venda.vendas;
export const selectFilteredVendas = (state) => state.venda.filteredVendas;
export const selectCurrentVenda = (state) => state.venda.currentVenda;
export const selectItensVenda = (state) => state.venda.itensVenda;
export const selectVendaLoading = (state) => state.venda.loading;
export const selectVendaError = (state) => state.venda.error;
export const selectVendaTotal = (state) => state.venda.total;
export const selectVendaPage = (state) => state.venda.page;
export const selectTicketMedio = (state) => state.venda.ticketMedio;
export default vendaSlice.reducer;
