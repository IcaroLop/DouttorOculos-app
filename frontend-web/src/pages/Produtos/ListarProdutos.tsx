import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setProdutos, setLoading, setError } from '@/redux/slices/produtoSlice';
import { selectProdutos, selectProdutoLoading } from '@/redux/slices/produtoSlice';
import { produtoService, Produto } from '@/services/produtoService';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  TextField,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';

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
    } catch (error: any) {
      dispatch(setError(error.message || 'Erro ao carregar produtos'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const filtrados = produtos.filter(
    (p: Produto) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigoSku.toLowerCase().includes(searchTerm)
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Produtos</h1>
        <Button variant="contained" color="primary" href="/produtos/novo">
          Novo Produto
        </Button>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nome ou SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Categoria</InputLabel>
          <Select
            value={categoria}
            label="Categoria"
            onChange={(e) => {
              setCategoria(e.target.value);
            }}
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="armacao">Armação</MenuItem>
            <MenuItem value="lente">Lente</MenuItem>
            <MenuItem value="solucao">Solução</MenuItem>
            <MenuItem value="acessorio">Acessório</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>SKU</strong></TableCell>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Categoria</strong></TableCell>
              <TableCell align="right"><strong>Preço</strong></TableCell>
              <TableCell align="right"><strong>Estoque</strong></TableCell>
              <TableCell><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrados.map((produto: Produto) => (
              <TableRow key={produto.id} hover>
                <TableCell>{produto.codigoSku}</TableCell>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>{produto.categoria}</TableCell>
                <TableCell align="right">R$ {produto.precoVenda.toFixed(2)}</TableCell>
                <TableCell align="right" sx={{ color: produto.estoque <= produto.estoqueMinimo ? 'red' : 'inherit' }}>
                  {produto.estoque} {produto.estoque <= produto.estoqueMinimo && '⚠️'}
                </TableCell>
                <TableCell>
                  <Button size="small" href={`/produtos/${produto.id}`}>
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filtrados.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Nenhum produto encontrado.
        </Alert>
      )}
    </Container>
  );
}
