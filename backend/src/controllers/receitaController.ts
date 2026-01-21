import { Request, Response, NextFunction } from 'express';
import * as receitaService from '../services/receitaService';

export async function createReceita(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId

    const resultado = await receitaService.criarReceita({
      lojaId,
      ...req.body,
    });

    return res.status(201).json(resultado);
  } catch (err) {
    return next(err);
  }
}

export async function listReceitasCliente(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId
    const clienteId = parseInt(req.params.clienteId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const resultado = await receitaService.listarReceitasCliente(lojaId, clienteId, page, limit);
    return res.json(resultado);
  } catch (err) {
    return next(err);
  }
}

export async function getReceita(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId
    const id = parseInt(req.params.id);

    const receita = await receitaService.obterReceita(id, lojaId);
    return res.json(receita);
  } catch (err) {
    return next(err);
  }
}

export async function updateReceita(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId
    const id = parseInt(req.params.id);

    const receita = await receitaService.atualizarReceita(id, lojaId, req.body);
    return res.json(receita);
  } catch (err) {
    return next(err);
  }
}

export async function deleteReceita(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId
    const id = parseInt(req.params.id);

    await receitaService.deletarReceita(id, lojaId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

export async function verificarValidadeReceita(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId
    const id = parseInt(req.params.id);

    const valida = await receitaService.verificarReceitaValida(id, lojaId);
    return res.json({ valida, diasRestantes: valida ? 365 : 0 });
  } catch (err) {
    return next(err);
  }
}

export async function getReceitasProximasAoVencimento(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId
    const diasAntecedencia = parseInt(req.query.dias as string) || 30;

    const receitas = await receitaService.obterReceitasProximasAoVencimento(lojaId, diasAntecedencia);
    return res.json({ data: receitas });
  } catch (err) {
    return next(err);
  }
}
