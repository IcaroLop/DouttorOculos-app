import { Request, Response, NextFunction } from 'express';
import * as clienteService from '../services/clienteService';

export async function createCliente(req: Request, res: Response, next: NextFunction) {
  try {
    // const portal = req.headers['x-portal'] as string;
    const lojaId = 1; // TODO: mapear portal para lojaId

    const resultado = await clienteService.criarCliente({
      lojaId,
      ...req.body,
    });

    return res.status(201).json(resultado);
  } catch (err) {
    return next(err);
  }
}

export async function listClientes(req: Request, res: Response, next: NextFunction) {
  try {
    // const portal = req.headers['x-portal'] as string;
    const lojaId = 1; // TODO: mapear portal para lojaId
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const ativo = req.query.ativo === 'false' ? false : req.query.ativo === 'true' ? true : undefined;

    const resultado = await clienteService.listarClientes(lojaId, page, limit, ativo);
    return res.json(resultado);
  } catch (err) {
    return next(err);
  }
}

export async function getCliente(req: Request, res: Response, next: NextFunction) {
  try {
    // const portal = req.headers['x-portal'] as string;
    const lojaId = 1; // TODO: mapear portal para lojaId
    const id = parseInt(req.params.id);

    const cliente = await clienteService.obterCliente(id, lojaId);
    return res.json(cliente);
  } catch (err) {
    return next(err);
  }
}

export async function updateCliente(req: Request, res: Response, next: NextFunction) {
  try {
    // const portal = req.headers['x-portal'] as string;
    const lojaId = 1; // TODO: mapear portal para lojaId
    const id = parseInt(req.params.id);

    const cliente = await clienteService.atualizarCliente(id, lojaId, req.body);
    return res.json(cliente);
  } catch (err) {
    return next(err);
  }
}

export async function deleteCliente(req: Request, res: Response, next: NextFunction) {
  try {
    // const portal = req.headers['x-portal'] as string;
    const lojaId = 1; // TODO: mapear portal para lojaId
    const id = parseInt(req.params.id);

    await clienteService.deletarCliente(id, lojaId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}
