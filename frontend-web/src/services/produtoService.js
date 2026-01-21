import api from './api';
export const produtoService = {
    async criar(data) {
        const response = await api.post('/api/v1/produtos', data);
        return response.data;
    },
    async listar(page = 1, limit = 50, categoria, ativo) {
        const params = { page, limit };
        if (categoria)
            Object.assign(params, { categoria });
        if (ativo !== undefined)
            Object.assign(params, { ativo });
        const response = await api.get('/api/v1/produtos', { params });
        return response.data;
    },
    async obter(id) {
        const response = await api.get(`/api/v1/produtos/${id}`);
        return response.data;
    },
    async atualizar(id, data) {
        const response = await api.put(`/api/v1/produtos/${id}`, data);
        return response.data;
    },
    async deletar(id) {
        await api.delete(`/api/v1/produtos/${id}`);
    },
    async obterComEstoqueBaixo() {
        const response = await api.get('/api/v1/produtos/baixo-estoque');
        return response.data;
    },
};
