import { Router } from 'express';
import { validateBody } from '../middleware/validateBody';
import {
  createReceitaSchema,
  updateReceitaSchema,
} from '../middleware/schemas';
import * as controller from '../controllers/receitaController';

const router = Router();

// POST /api/v1/receitas - Criar receita
router.post('/', validateBody(createReceitaSchema), controller.createReceita);

// GET /api/v1/receitas/cliente/:clienteId - Listar receitas de um cliente
router.get('/cliente/:clienteId', controller.listReceitasCliente);

// GET /api/v1/receitas/proximasAoVencimento - Receitas próximas ao vencimento
router.get('/proximasAoVencimento', controller.getReceitasProximasAoVencimento);

// GET /api/v1/receitas/:id - Obter receita
router.get('/:id', controller.getReceita);

// GET /api/v1/receitas/:id/validade - Verificar se receita é válida
router.get('/:id/validade', controller.verificarValidadeReceita);

// PUT /api/v1/receitas/:id - Atualizar receita
router.put('/:id', validateBody(updateReceitaSchema), controller.updateReceita);

// DELETE /api/v1/receitas/:id - Deletar receita
router.delete('/:id', controller.deleteReceita);

export default router;
