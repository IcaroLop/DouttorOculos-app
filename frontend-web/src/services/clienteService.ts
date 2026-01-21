import api from './api';

export interface Cliente {
  id: number;
  lojaId: number;
  nome: string;
  email?: string | null;
  telefone: string;
  cpf: string;
  dataNascimento?: Date | null;
  endereco?: string | null;
  ativo: boolean;
  criadoEm: Date;
}

export interface CreateClienteRequest {
  nome: string;
  cpf: string;
  telefone: string;
  email?: string | null;
  dataNascimento?: Date | null;
  endereco?: string | null;
}

export const clienteService = {
  async criar(data: CreateClienteRequest): Promise<Cliente> {
    const response = await api.post('/api/v1/clientes', data);
    return response.data;
  },

  async listar(page = 1, limit = 50, ativo?: boolean) {
    const params = { page, limit };
    if (ativo !== undefined) {
      Object.assign(params, { ativo });
    }
    const response = await api.get('/api/v1/clientes', { params });
    return response.data;
  },

  async obter(id: number): Promise<Cliente> {
    const response = await api.get(`/api/v1/clientes/${id}`);
    return response.data;
  },

  async atualizar(id: number, data: Partial<CreateClienteRequest>): Promise<Cliente> {
    const response = await api.put(`/api/v1/clientes/${id}`, data);
    return response.data;
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/api/v1/clientes/${id}`);
  },
};
