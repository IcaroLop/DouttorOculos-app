import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setClientes, setLoading, setError } from '../redux/slices/clienteSlice';
import { selectClientes, selectClienteLoading } from '../redux/slices/clienteSlice';
import { clienteService } from '../services/clienteService';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, TextField, CircularProgress, Alert, } from '@mui/material';
export function ListarClientes() {
    const dispatch = useAppDispatch();
    const clientes = useAppSelector(selectClientes);
    const loading = useAppSelector(selectClienteLoading);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        carregarClientes();
    }, []);
    const carregarClientes = async () => {
        try {
            dispatch(setLoading(true));
            const result = await clienteService.listar();
            dispatch(setClientes({ data: result.data, total: result.total, page: 1 }));
        }
        catch (error) {
            dispatch(setError(error.message || 'Erro ao carregar clientes'));
        }
        finally {
            dispatch(setLoading(false));
        }
    };
    const filtrados = clientes.filter((c) => c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cpf.includes(searchTerm) ||
        c.telefone.includes(searchTerm));
    if (loading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", p: 4, children: _jsx(CircularProgress, {}) }));
    }
    return (_jsxs(Container, { maxWidth: "lg", sx: { py: 4 }, children: [_jsxs(Box, { sx: { mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("h1", { children: "Clientes" }), _jsx(Button, { variant: "contained", color: "primary", href: "/clientes/novo", children: "Novo Cliente" })] }), _jsx(TextField, { fullWidth: true, placeholder: "Buscar por nome, CPF ou telefone...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), sx: { mb: 3 } }), _jsx(TableContainer, { component: Paper, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { backgroundColor: '#f5f5f5' }, children: [_jsx(TableCell, { children: _jsx("strong", { children: "Nome" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "CPF" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Telefone" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Email" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "A\u00E7\u00F5es" }) })] }) }), _jsx(TableBody, { children: filtrados.map((cliente) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: cliente.nome }), _jsx(TableCell, { children: cliente.cpf }), _jsx(TableCell, { children: cliente.telefone }), _jsx(TableCell, { children: cliente.email || '-' }), _jsxs(TableCell, { children: [_jsx(Button, { size: "small", href: `/clientes/${cliente.id}`, children: "Ver" }), _jsx(Button, { size: "small", color: "error", children: "Deletar" })] })] }, cliente.id))) })] }) }), filtrados.length === 0 && (_jsx(Alert, { severity: "info", sx: { mt: 2 }, children: "Nenhum cliente encontrado." }))] }));
}
