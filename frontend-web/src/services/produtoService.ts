import api from './api';

export interface Produto {
  id: number;
  lojaId: number;
  codigoSku: string;
  nome: string;
  descricao?: string | null;
  categoria: 'armacao' | 'lente' | 'solucao' | 'acessorio';
  precoCusto?: number | null;
  precoVenda: number;
  estoque: number;
  estoqueMinimo: number;
  imagemUrl?: string | null;
  ativo: boolean;
  criadoEm: Date;
}

export interface CreateProdutoRequest {
  codigoSku: string;
  nome: string;
  descricao?: string | null;
  categoria: 'armacao' | 'lente' | 'solucao' | 'acessorio';
  precoCusto?: number | null;
  precoVenda: number;
  estoque?: number;
  estoqueMinimo?: number;
  imagemUrl?: string | null;
}

export const produtoService = {
  async criar(data: CreateProdutoRequest): Promise<Produto> {
    const response = await api.post('/api/v1/produtos', data);
    return response.data;
  },

  async listar(page = 1, limit = 50, categoria?: string, ativo?: boolean) {
    const params = { page, limit };
    if (categoria) Object.assign(params, { categoria });
    if (ativo !== undefined) Object.assign(params, { ativo });
    const response = await api.get('/api/v1/produtos', { params });
    return response.data;
  },

  async obter(id: number): Promise<Produto> {
    const response = await api.get(`/api/v1/produtos/${id}`);
    return response.data;
  },

  async atualizar(id: number, data: Partial<CreateProdutoRequest>): Promise<Produto> {
    const response = await api.put(`/api/v1/produtos/${id}`, data);
    return response.data;
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/api/v1/produtos/${id}`);
  },

  async obterComEstoqueBaixo() {
    const response = await api.get('/api/v1/produtos/baixo-estoque');
    return response.data;
  },
};
