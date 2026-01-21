import { Router } from 'express';
import authRoutes from './auth.routes';
import clienteRoutes from './cliente.routes';
import produtoRoutes from './produto.routes';
import receitaRoutes from './receita.routes';
import vendaRoutes from './venda.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/clientes', clienteRoutes);
routes.use('/produtos', produtoRoutes);
routes.use('/receitas', receitaRoutes);
routes.use('/vendas', vendaRoutes);

export default routes;
