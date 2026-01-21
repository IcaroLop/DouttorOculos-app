import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Produto } from '../entities/Produto';

const produtoRepo = (): Repository<Produto> => AppDataSource.getRepository(Produto);

export type CreateProdutoInput = {
  lojaId: number;
  codigoSku: string;
  nome: string;
  descricao?: string | null;
  categoria: 'armacao' | 'lente' | 'solucao' | 'acessorio';
  precoCusto?: number | null;
  precoVenda: number;
  estoque?: number;
  estoqueMinimo?: number;
  imagemUrl?: string | null;
};

export type UpdateProdutoInput = Partial<CreateProdutoInput>;

export async function criarProduto(input: CreateProdutoInput): Promise<Produto> {
  const repo = produtoRepo();

  // Validar SKU único
  const existing = await repo.findOne({ where: { codigoSku: input.codigoSku } });
  if (existing) {
    const error: any = new Error('Código SKU já existe');
    error.status = 400;
    throw error;
  }

  // Validar preço
  if (input.precoCusto && input.precoVenda <= input.precoCusto) {
    const error: any = new Error('Preço de venda deve ser maior que o preço de custo');
    error.status = 400;
    throw error;
  }

  const produto = repo.create({
    lojaId: input.lojaId,
    codigoSku: input.codigoSku,
    nome: input.nome,
    descricao: input.descricao || null,
    categoria: input.categoria,
    precoCusto: input.precoCusto || null,
    precoVenda: input.precoVenda,
    estoque: input.estoque || 0,
    estoqueMinimo: input.estoqueMinimo || 5,
    imagemUrl: input.imagemUrl || null,
    ativo: true,
  });

  return repo.save(produto);
}

export async function listarProdutos(
  lojaId: number,
  page: number = 1,
  limit: number = 50,
  categoria?: string,
  ativo?: boolean
): Promise<{ data: Produto[]; total: number }> {
  const repo = produtoRepo();
  const query = repo.createQueryBuilder('produto').where('produto.loja_id = :lojaId', { lojaId });

  if (categoria) {
    query.andWhere('produto.categoria = :categoria', { categoria });
  }

  if (ativo !== undefined) {
    query.andWhere('produto.ativo = :ativo', { ativo });
  }

  const total = await query.getCount();
  const data = await query
    .skip((page - 1) * limit)
    .take(limit)
    .orderBy('produto.criado_em', 'DESC')
    .getMany();

  return { data, total };
}

export async function obterProduto(id: number, lojaId: number): Promise<Produto> {
  const repo = produtoRepo();
  const produto = await repo.findOne({ where: { id, lojaId } });

  if (!produto) {
    const error: any = new Error('Produto não encontrado');
    error.status = 404;
    throw error;
  }

  return produto;
}

export async function atualizarProduto(id: number, lojaId: number, input: UpdateProdutoInput): Promise<Produto> {
  const repo = produtoRepo();
  const produto = await obterProduto(id, lojaId);

  // Validar SKU único (se alterado)
  if (input.codigoSku && input.codigoSku !== produto.codigoSku) {
    const existing = await repo.findOne({ where: { codigoSku: input.codigoSku } });
    if (existing) {
      const error: any = new Error('Código SKU já existe');
      error.status = 400;
      throw error;
    }
  }

  // Validar preço
  if (input.precoCusto || input.precoVenda) {
    const precoCusto = input.precoCusto ?? produto.precoCusto;
    const precoVenda = input.precoVenda ?? produto.precoVenda;
    if (precoCusto && precoVenda <= precoCusto) {
      const error: any = new Error('Preço de venda deve ser maior que o preço de custo');
      error.status = 400;
      throw error;
    }
  }

  Object.assign(produto, input);
  return repo.save(produto);
}

export async function deletarProduto(id: number, lojaId: number): Promise<void> {
  const repo = produtoRepo();
  const produto = await obterProduto(id, lojaId);

  // Soft delete
  produto.ativo = false;
  await repo.save(produto);
}

export async function atualizarEstoque(id: number, lojaId: number, quantidade: number): Promise<Produto> {
  const repo = produtoRepo();
  const produto = await obterProduto(id, lojaId);

  produto.estoque += quantidade;
  if (produto.estoque < 0) {
    const error: any = new Error('Estoque não pode ser negativo');
    error.status = 400;
    throw error;
  }

  return repo.save(produto);
}

export async function obterProdutosComEstoqueBaixo(lojaId: number): Promise<Produto[]> {
  const repo = produtoRepo();
  return repo.find({
    where: {
      lojaId,
      ativo: true,
    },
  }).then((produtos) => produtos.filter((p) => p.estoque <= p.estoqueMinimo));
}
