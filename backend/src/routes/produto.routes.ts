import { Router } from 'express';
import { validateBody } from '../middleware/validateBody';
import {
  createProdutoSchema,
  updateProdutoSchema,
} from '../middleware/schemas';
import * as controller from '../controllers/produtoController';

const router = Router();

// POST /api/v1/produtos - Criar produto
router.post('/', validateBody(createProdutoSchema), controller.createProduto);

// GET /api/v1/produtos - Listar produtos
router.get('/', controller.listProdutos);

// GET /api/v1/produtos/baixo-estoque - Produtos com estoque baixo
router.get('/baixo-estoque', controller.getProdutosComEstoqueBaixo);

// GET /api/v1/produtos/:id - Obter produto
router.get('/:id', controller.getProduto);

// PUT /api/v1/produtos/:id - Atualizar produto
router.put('/:id', validateBody(updateProdutoSchema), controller.updateProduto);

// DELETE /api/v1/produtos/:id - Deletar produto
router.delete('/:id', controller.deleteProduto);

export default router;
