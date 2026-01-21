import { createSlice } from '@reduxjs/toolkit';
const initialState = {
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
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setClientes: (state, action) => {
            state.clientes = action.payload.data;
            state.filteredClientes = action.payload.data;
            state.total = action.payload.total;
            state.page = action.payload.page;
        },
        addCliente: (state, action) => {
            state.clientes.push(action.payload);
            state.filteredClientes = state.clientes;
        },
        updateCliente: (state, action) => {
            const index = state.clientes.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.clientes[index] = action.payload;
                state.filteredClientes = state.clientes;
            }
        },
        removeCliente: (state, action) => {
            state.clientes = state.clientes.filter((c) => c.id !== action.payload);
            state.filteredClientes = state.clientes;
        },
        setCurrentCliente: (state, action) => {
            state.currentCliente = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        filterClientes: (state, action) => {
            const term = action.payload.toLowerCase();
            state.filteredClientes = state.clientes.filter((c) => c.nome.toLowerCase().includes(term) ||
                c.cpf.includes(term) ||
                c.telefone.includes(term) ||
                (c.email && c.email.toLowerCase().includes(term)));
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});
export const { setLoading, setError, setClientes, addCliente, updateCliente, removeCliente, setCurrentCliente, setPage, filterClientes, clearError, } = clienteSlice.actions;
export const selectClientes = (state) => state.cliente.clientes;
export const selectFilteredClientes = (state) => state.cliente.filteredClientes;
export const selectCurrentCliente = (state) => state.cliente.currentCliente;
export const selectClienteLoading = (state) => state.cliente.loading;
export const selectClienteError = (state) => state.cliente.error;
export const selectClienteTotal = (state) => state.cliente.total;
export const selectClientePage = (state) => state.cliente.page;
export default clienteSlice.reducer;
