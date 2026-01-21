import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setVendas, setLoading, setError } from '../redux/slices/vendaSlice';
import { selectVendas, selectVendaLoading } from '../redux/slices/vendaSlice';
import { vendaService } from '../services/vendaService';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, TextField, CircularProgress, Alert, Chip, Select, MenuItem, FormControl, InputLabel, Stack, } from '@mui/material';
const statusColors = {
    pendente: 'warning',
    concluida: 'success',
    cancelada: 'error',
};
export function ListarVendas() {
    const dispatch = useAppDispatch();
    const vendas = useAppSelector(selectVendas);
    const loading = useAppSelector(selectVendaLoading);
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('');
    useEffect(() => {
        carregarVendas();
    }, []);
    const carregarVendas = async () => {
        try {
            dispatch(setLoading(true));
            const result = await vendaService.listar(1, 50, status || undefined);
            dispatch(setVendas({ data: result.data, total: result.total, page: 1 }));
        }
        catch (error) {
            dispatch(setError(error.message || 'Erro ao carregar vendas'));
        }
        finally {
            dispatch(setLoading(false));
        }
    };
    const filtrados = vendas.filter((v) => v.id.toString().includes(searchTerm) ||
        (v.clienteId && v.clienteId.toString().includes(searchTerm)));
    if (loading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", p: 4, children: _jsx(CircularProgress, {}) }));
    }
    return (_jsxs(Container, { maxWidth: "lg", sx: { py: 4 }, children: [_jsxs(Box, { sx: { mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("h1", { children: "Vendas" }), _jsx(Button, { variant: "contained", color: "primary", href: "/vendas/nova", children: "Nova Venda" })] }), _jsxs(Stack, { direction: "row", spacing: 2, sx: { mb: 3 }, children: [_jsx(TextField, { fullWidth: true, placeholder: "Buscar por ID ou Cliente...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }), _jsxs(FormControl, { sx: { minWidth: 200 }, children: [_jsx(InputLabel, { children: "Status" }), _jsxs(Select, { value: status, label: "Status", onChange: (e) => {
                                    setStatus(e.target.value);
                                }, children: [_jsx(MenuItem, { value: "", children: "Todos" }), _jsx(MenuItem, { value: "pendente", children: "Pendente" }), _jsx(MenuItem, { value: "concluida", children: "Conclu\u00EDda" }), _jsx(MenuItem, { value: "cancelada", children: "Cancelada" })] })] })] }), _jsx(TableContainer, { component: Paper, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { backgroundColor: '#f5f5f5' }, children: [_jsx(TableCell, { children: _jsx("strong", { children: "ID" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Data" }) }), _jsx(TableCell, { align: "right", children: _jsx("strong", { children: "Total" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Pagamento" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Status" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "A\u00E7\u00F5es" }) })] }) }), _jsx(TableBody, { children: filtrados.map((venda) => (_jsxs(TableRow, { hover: true, children: [_jsxs(TableCell, { children: ["#", venda.id] }), _jsx(TableCell, { children: new Date(venda.criadoEm).toLocaleDateString('pt-BR') }), _jsxs(TableCell, { align: "right", children: ["R$ ", venda.total.toFixed(2)] }), _jsx(TableCell, { children: venda.metodoPagamento }), _jsx(TableCell, { children: _jsx(Chip, { label: venda.status, color: statusColors[venda.status], size: "small" }) }), _jsx(TableCell, { children: _jsx(Button, { size: "small", href: `/vendas/${venda.id}`, children: "Ver" }) })] }, venda.id))) })] }) }), filtrados.length === 0 && (_jsx(Alert, { severity: "info", sx: { mt: 2 }, children: "Nenhuma venda encontrada." }))] }));
}
