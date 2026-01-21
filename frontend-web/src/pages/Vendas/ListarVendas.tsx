import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setVendas, setLoading, setError } from '@/redux/slices/vendaSlice';
import { selectVendas, selectVendaLoading } from '@/redux/slices/vendaSlice';
import { vendaService, Venda } from '@/services/vendaService';
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
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';

const statusColors: { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' } = {
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
    } catch (error: any) {
      dispatch(setError(error.message || 'Erro ao carregar vendas'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const filtrados = vendas.filter((v: Venda) =>
    v.id.toString().includes(searchTerm) ||
    (v.clienteId && v.clienteId.toString().includes(searchTerm))
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
        <h1>Vendas</h1>
        <Button variant="contained" color="primary" href="/vendas/nova">
          Nova Venda
        </Button>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por ID ou Cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => {
              setStatus(e.target.value);
            }}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="pendente">Pendente</MenuItem>
            <MenuItem value="concluida">Concluída</MenuItem>
            <MenuItem value="cancelada">Cancelada</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Data</strong></TableCell>
              <TableCell align="right"><strong>Total</strong></TableCell>
              <TableCell><strong>Pagamento</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrados.map((venda: Venda) => (
              <TableRow key={venda.id} hover>
                <TableCell>#{venda.id}</TableCell>
                <TableCell>{new Date(venda.criadoEm).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell align="right">R$ {venda.total.toFixed(2)}</TableCell>
                <TableCell>{venda.metodoPagamento}</TableCell>
                <TableCell>
                  <Chip label={venda.status} color={statusColors[venda.status]} size="small" />
                </TableCell>
                <TableCell>
                  <Button size="small" href={`/vendas/${venda.id}`}>
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
          Nenhuma venda encontrada.
        </Alert>
      )}
    </Container>
  );
}
