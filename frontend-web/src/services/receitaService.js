import api from './api';
export const receitaService = {
    async criar(data) {
        const response = await api.post('/api/v1/receitas', data);
        return response.data;
    },
    async listarPorCliente(clienteId, page = 1, limit = 50) {
        const response = await api.get(`/api/v1/receitas/cliente/${clienteId}`, { params: { page, limit } });
        return response.data;
    },
    async obter(id) {
        const response = await api.get(`/api/v1/receitas/${id}`);
        return response.data;
    },
    async atualizar(id, data) {
        const response = await api.put(`/api/v1/receitas/${id}`, data);
        return response.data;
    },
    async deletar(id) {
        await api.delete(`/api/v1/receitas/${id}`);
    },
    async verificarValidade(id) {
        const response = await api.get(`/api/v1/receitas/${id}/validade`);
        return response.data;
    },
    async obterProximasAoVencimento(dias = 30) {
        const response = await api.get('/api/v1/receitas/proximasAoVencimento', { params: { dias } });
        return response.data;
    },
};
