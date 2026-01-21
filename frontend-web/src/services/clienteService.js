import api from './api';
export const clienteService = {
    async criar(data) {
        const response = await api.post('/api/v1/clientes', data);
        return response.data;
    },
    async listar(page = 1, limit = 50, ativo) {
        const params = { page, limit };
        if (ativo !== undefined) {
            Object.assign(params, { ativo });
        }
        const response = await api.get('/api/v1/clientes', { params });
        return response.data;
    },
    async obter(id) {
        const response = await api.get(`/api/v1/clientes/${id}`);
        return response.data;
    },
    async atualizar(id, data) {
        const response = await api.put(`/api/v1/clientes/${id}`, data);
        return response.data;
    },
    async deletar(id) {
        await api.delete(`/api/v1/clientes/${id}`);
    },
};
