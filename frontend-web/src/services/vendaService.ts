import api from './api';

export interface ItemVenda {
  id: number;
  vendaId: number;
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Venda {
  id: number;
  lojaId: number;
  clienteId?: number | null;
  vendedorId: number;
  total: number;
  desconto: number;
  metodoPagamento: 'dinheiro' | 'credito' | 'debito' | 'pix';
  status: 'pendente' | 'concluida' | 'cancelada';
  criadoEm: Date;
  itens?: ItemVenda[];
}

export interface CreateVendaRequest {
  clienteId?: number | null;
  vendedorId: number;
  total: number;
  desconto?: number;
  metodoPagamento: 'dinheiro' | 'credito' | 'debito' | 'pix';
  itens: Array<{
    produtoId: number;
    quantidade: number;
    precoUnitario: number;
  }>;
}

export const vendaService = {
  async criar(data: CreateVendaRequest) {
    const response = await api.post('/api/v1/vendas', data);
    return response.data;
  },

  async listar(page = 1, limit = 50, status?: string) {
    const params = { page, limit };
    if (status) Object.assign(params, { status });
    const response = await api.get('/api/v1/vendas', { params });
    return response.data;
  },

  async obter(id: number): Promise<Venda> {
    const response = await api.get(`/api/v1/vendas/${id}`);
    return response.data;
  },

  async atualizarStatus(id: number, novoStatus: 'pendente' | 'concluida' | 'cancelada'): Promise<Venda> {
    const response = await api.put(`/api/v1/vendas/${id}/status`, { status: novoStatus });
    return response.data;
  },

  async listarPorCliente(clienteId: number, page = 1, limit = 50) {
    const response = await api.get(`/api/v1/vendas/cliente/${clienteId}`, { params: { page, limit } });
    return response.data;
  },

  async obterTicketMedio(dataInicio?: Date, dataFim?: Date) {
    const params: any = {};
    if (dataInicio) params.dataInicio = dataInicio;
    if (dataFim) params.dataFim = dataFim;
    const response = await api.get('/api/v1/vendas/relatorio/ticket-medio', { params });
    return response.data;
  },
};
