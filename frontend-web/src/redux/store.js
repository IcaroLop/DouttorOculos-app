import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clienteReducer from './slices/clienteSlice';
import produtoReducer from './slices/produtoSlice';
import vendaReducer from './slices/vendaSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        cliente: clienteReducer,
        produto: produtoReducer,
        venda: vendaReducer,
    },
});
