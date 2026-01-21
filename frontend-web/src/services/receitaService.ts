import api from './api';

export interface Receita {
  id: number;
  lojaId: number;
  clienteId: number;
  oticoId: number;
  dataReceita: Date;
  esferaOd?: number | null;
  cilindroOd?: number | null;
  eixoOd?: number | null;
  esferaOe?: number | null;
  cilindroOe?: number | null;
  eixoOe?: number | null;
  adicao?: number | null;
  distanciaPupilar?: number | null;
  observacoes?: string | null;
  ativo: boolean;
  criadoEm: Date;
}

export interface CreateReceitaRequest {
  clienteId: number;
  oticoId: number;
  dataReceita: Date;
  esferaOd?: number | null;
  cilindroOd?: number | null;
  eixoOd?: number | null;
  esferaOe?: number | null;
  cilindroOe?: number | null;
  eixoOe?: number | null;
  adicao?: number | null;
  distanciaPupilar?: number | null;
  observacoes?: string | null;
}

export const receitaService = {
  async criar(data: CreateReceitaRequest): Promise<Receita> {
    const response = await api.post('/api/v1/receitas', data);
    return response.data;
  },

  async listarPorCliente(clienteId: number, page = 1, limit = 50) {
    const response = await api.get(`/api/v1/receitas/cliente/${clienteId}`, { params: { page, limit } });
    return response.data;
  },

  async obter(id: number): Promise<Receita> {
    const response = await api.get(`/api/v1/receitas/${id}`);
    return response.data;
  },

  async atualizar(id: number, data: Partial<CreateReceitaRequest>): Promise<Receita> {
    const response = await api.put(`/api/v1/receitas/${id}`, data);
    return response.data;
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/api/v1/receitas/${id}`);
  },

  async verificarValidade(id: number) {
    const response = await api.get(`/api/v1/receitas/${id}/validade`);
    return response.data;
  },

  async obterProximasAoVencimento(dias = 30) {
    const response = await api.get('/api/v1/receitas/proximasAoVencimento', { params: { dias } });
    return response.data;
  },
};
