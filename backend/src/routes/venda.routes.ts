import { Router } from 'express';
import { validateBody } from '../middleware/validateBody';
import {
  createVendaSchema,
  updateVendaSchema,
} from '../middleware/schemas';
import * as controller from '../controllers/vendaController';

const router = Router();

// POST /api/v1/vendas - Criar venda
router.post('/', validateBody(createVendaSchema), controller.createVenda);

// GET /api/v1/vendas - Listar vendas
router.get('/', controller.listVendas);

// GET /api/v1/vendas/cliente/:clienteId - Vendas de um cliente
router.get('/cliente/:clienteId', controller.getVendasPorCliente);

// GET /api/v1/vendas/relatorio/ticket-medio - Ticket médio
router.get('/relatorio/ticket-medio', controller.getTicketMedio);

// GET /api/v1/vendas/:id - Obter venda
router.get('/:id', controller.getVenda);

// PUT /api/v1/vendas/:id/status - Atualizar status da venda
router.put('/:id/status', validateBody(updateVendaSchema), controller.updateVendaStatus);

export default router;
