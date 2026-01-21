import { Router } from 'express';
import { validateBody } from '../middleware/validateBody';
import {
  createClienteSchema,
  updateClienteSchema,
} from '../middleware/schemas';
import * as controller from '../controllers/clienteController';

const router = Router();

// POST /api/v1/clientes - Criar cliente
router.post('/', validateBody(createClienteSchema), controller.createCliente);

// GET /api/v1/clientes - Listar clientes
router.get('/', controller.listClientes);

// GET /api/v1/clientes/:id - Obter cliente
router.get('/:id', controller.getCliente);

// PUT /api/v1/clientes/:id - Atualizar cliente
router.put('/:id', validateBody(updateClienteSchema), controller.updateCliente);

// DELETE /api/v1/clientes/:id - Deletar cliente
router.delete('/:id', controller.deleteCliente);

export default router;
