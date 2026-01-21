import { Request, Response, NextFunction } from 'express';
import * as produtoService from '../services/produtoService';

export async function createProduto(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId

    const resultado = await produtoService.criarProduto({
      lojaId,
      ...req.body,
    });

    return res.status(201).json(resultado);
  } catch (err) {
    return next(err);
  }
}

export async function listProdutos(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const categoria = req.query.categoria as string;
    const ativo = req.query.ativo === 'false' ? false : req.query.ativo === 'true' ? true : undefined;

    const resultado = await produtoService.listarProdutos(lojaId, page, limit, categoria, ativo);
    return res.json(resultado);
  } catch (err) {
    return next(err);
  }
}

export async function getProduto(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId
    const id = parseInt(req.params.id);

    const produto = await produtoService.obterProduto(id, lojaId);
    return res.json(produto);
  } catch (err) {
    return next(err);
  }
}

export async function updateProduto(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId
    const id = parseInt(req.params.id);

    const produto = await produtoService.atualizarProduto(id, lojaId, req.body);
    return res.json(produto);
  } catch (err) {
    return next(err);
  }
}

export async function deleteProduto(req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId
    const id = parseInt(req.params.id);

    await produtoService.deletarProduto(id, lojaId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

export async function getProdutosComEstoqueBaixo(_req: Request, res: Response, next: NextFunction) {
  try {
    const lojaId = 1; // TODO: mapear portal para lojaId

    const produtos = await produtoService.obterProdutosComEstoqueBaixo(lojaId);
    return res.json({ data: produtos });
  } catch (err) {
    return next(err);
  }
}
