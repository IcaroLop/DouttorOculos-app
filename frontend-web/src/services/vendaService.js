import api from './api';
export const vendaService = {
    async criar(data) {
        const response = await api.post('/api/v1/vendas', data);
        return response.data;
    },
    async listar(page = 1, limit = 50, status) {
        const params = { page, limit };
        if (status)
            Object.assign(params, { status });
        const response = await api.get('/api/v1/vendas', { params });
        return response.data;
    },
    async obter(id) {
        const response = await api.get(`/api/v1/vendas/${id}`);
        return response.data;
    },
    async atualizarStatus(id, novoStatus) {
        const response = await api.put(`/api/v1/vendas/${id}/status`, { status: novoStatus });
        return response.data;
    },
    async listarPorCliente(clienteId, page = 1, limit = 50) {
        const response = await api.get(`/api/v1/vendas/cliente/${clienteId}`, { params: { page, limit } });
        return response.data;
    },
    async obterTicketMedio(dataInicio, dataFim) {
        const params = {};
        if (dataInicio)
            params.dataInicio = dataInicio;
        if (dataFim)
            params.dataFim = dataFim;
        const response = await api.get('/api/v1/vendas/relatorio/ticket-medio', { params });
        return response.data;
    },
};
