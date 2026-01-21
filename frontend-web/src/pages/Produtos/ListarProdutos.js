import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setProdutos, setLoading, setError } from '../redux/slices/produtoSlice';
import { selectProdutos, selectProdutoLoading } from '../redux/slices/produtoSlice';
import { produtoService } from '../services/produtoService';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, TextField, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel, Stack, } from '@mui/material';
export function ListarProdutos() {
    const dispatch = useAppDispatch();
    const produtos = useAppSelector(selectProdutos);
    const loading = useAppSelector(selectProdutoLoading);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoria, setCategoria] = useState('');
    useEffect(() => {
        carregarProdutos();
    }, []);
    const carregarProdutos = async () => {
        try {
            dispatch(setLoading(true));
            const result = await produtoService.listar(1, 50, categoria || undefined);
            dispatch(setProdutos({ data: result.data, total: result.total, page: 1 }));
        }
        catch (error) {
            dispatch(setError(error.message || 'Erro ao carregar produtos'));
        }
        finally {
            dispatch(setLoading(false));
        }
    };
    const filtrados = produtos.filter((p) => p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codigoSku.toLowerCase().includes(searchTerm));
    if (loading) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", p: 4, children: _jsx(CircularProgress, {}) }));
    }
    return (_jsxs(Container, { maxWidth: "lg", sx: { py: 4 }, children: [_jsxs(Box, { sx: { mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("h1", { children: "Produtos" }), _jsx(Button, { variant: "contained", color: "primary", href: "/produtos/novo", children: "Novo Produto" })] }), _jsxs(Stack, { direction: "row", spacing: 2, sx: { mb: 3 }, children: [_jsx(TextField, { fullWidth: true, placeholder: "Buscar por nome ou SKU...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }), _jsxs(FormControl, { sx: { minWidth: 200 }, children: [_jsx(InputLabel, { children: "Categoria" }), _jsxs(Select, { value: categoria, label: "Categoria", onChange: (e) => {
                                    setCategoria(e.target.value);
                                }, children: [_jsx(MenuItem, { value: "", children: "Todas" }), _jsx(MenuItem, { value: "armacao", children: "Arma\u00E7\u00E3o" }), _jsx(MenuItem, { value: "lente", children: "Lente" }), _jsx(MenuItem, { value: "solucao", children: "Solu\u00E7\u00E3o" }), _jsx(MenuItem, { value: "acessorio", children: "Acess\u00F3rio" })] })] })] }), _jsx(TableContainer, { component: Paper, children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { backgroundColor: '#f5f5f5' }, children: [_jsx(TableCell, { children: _jsx("strong", { children: "SKU" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Nome" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Categoria" }) }), _jsx(TableCell, { align: "right", children: _jsx("strong", { children: "Pre\u00E7o" }) }), _jsx(TableCell, { align: "right", children: _jsx("strong", { children: "Estoque" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "A\u00E7\u00F5es" }) })] }) }), _jsx(TableBody, { children: filtrados.map((produto) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: produto.codigoSku }), _jsx(TableCell, { children: produto.nome }), _jsx(TableCell, { children: produto.categoria }), _jsxs(TableCell, { align: "right", children: ["R$ ", produto.precoVenda.toFixed(2)] }), _jsxs(TableCell, { align: "right", sx: { color: produto.estoque <= produto.estoqueMinimo ? 'red' : 'inherit' }, children: [produto.estoque, " ", produto.estoque <= produto.estoqueMinimo && '⚠️'] }), _jsx(TableCell, { children: _jsx(Button, { size: "small", href: `/produtos/${produto.id}`, children: "Ver" }) })] }, produto.id))) })] }) }), filtrados.length === 0 && (_jsx(Alert, { severity: "info", sx: { mt: 2 }, children: "Nenhum produto encontrado." }))] }));
}
