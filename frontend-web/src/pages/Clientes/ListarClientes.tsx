import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setClientes, setLoading, setError } from '@/redux/slices/clienteSlice';
import { selectClientes, selectClienteLoading } from '@/redux/slices/clienteSlice';
import { clienteService, Cliente } from '@/services/clienteService';
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
} from '@mui/material';

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
    } catch (error: any) {
      dispatch(setError(error.message || 'Erro ao carregar clientes'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const filtrados = clientes.filter((c: Cliente) =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cpf.includes(searchTerm) ||
    c.telefone.includes(searchTerm)
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
        <h1>Clientes</h1>
        <Button variant="contained" color="primary" href="/clientes/novo">
          Novo Cliente
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Buscar por nome, CPF ou telefone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>CPF</strong></TableCell>
              <TableCell><strong>Telefone</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrados.map((cliente: Cliente) => (
              <TableRow key={cliente.id} hover>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.cpf}</TableCell>
                <TableCell>{cliente.telefone}</TableCell>
                <TableCell>{cliente.email || '-'}</TableCell>
                <TableCell>
                  <Button size="small" href={`/clientes/${cliente.id}`}>
                    Ver
                  </Button>
                  <Button size="small" color="error">
                    Deletar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filtrados.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Nenhum cliente encontrado.
        </Alert>
      )}
    </Container>
  );
}
