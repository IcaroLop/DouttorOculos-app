import { Request, Response, NextFunction } from 'express';
import * as vendaService from '../services/vendaService';

export async function createVenda(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId

    const resultado = await vendaService.criarVenda({
      lojaId,
      ...req.body,
    });

    return res.status(201).json(resultado);
  } catch (err) {
    return next(err);
  }
}

export async function listVendas(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const status = req.query.status as string;

    const resultado = await vendaService.listarVendas(lojaId, page, limit, status);
    return res.json(resultado);
  } catch (err) {
    return next(err);
  }
}

export async function getVenda(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId
    const id = parseInt(req.params.id);

    const venda = await vendaService.obterVenda(id, lojaId);
    const itens = await vendaService.obterItensVenda(id);

    return res.json({ ...venda, itens });
  } catch (err) {
    return next(err);
  }
}

export async function updateVendaStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const venda = await vendaService.atualizarStatusVenda(id, lojaId, status);
    return res.json(venda);
  } catch (err) {
    return next(err);
  }
}

export async function getVendasPorCliente(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId
    const clienteId = parseInt(req.params.clienteId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const resultado = await vendaService.obterVendasPorCliente(lojaId, clienteId, page, limit);
    return res.json(resultado);
  } catch (err) {
    return next(err);
  }
}

export async function getTicketMedio(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId
    const dataInicio = req.query.dataInicio ? new Date(req.query.dataInicio as string) : undefined;
    const dataFim = req.query.dataFim ? new Date(req.query.dataFim as string) : undefined;

    const ticketMedio = await vendaService.obterTicketMedio(lojaId, dataInicio, dataFim);
    return res.json({ ticketMedio });
  } catch (err) {
    return next(err);
  }
}
