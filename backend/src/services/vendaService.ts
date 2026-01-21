import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Venda } from '../entities/Venda';
import { ItemVenda } from '../entities/ItemVenda';
import { atualizarEstoque } from './produtoService';

const vendaRepo = (): Repository<Venda> => AppDataSource.getRepository(Venda);
const itemVendaRepo = (): Repository<ItemVenda> => AppDataSource.getRepository(ItemVenda);

export type ItemVendaInput = {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
};

export type CreateVendaInput = {
  lojaId: number;
  clienteId?: number | null;
  vendedorId: number;
  total: number;
  desconto?: number;
  metodoPagamento: 'dinheiro' | 'credito' | 'debito' | 'pix';
  itens: ItemVendaInput[];
};

export async function criarVenda(input: CreateVendaInput): Promise<{ venda: Venda; itens: ItemVenda[] }> {
  const vRepo = vendaRepo();
  const ivRepo = itemVendaRepo();

  // Criar venda
  const venda = vRepo.create({
    lojaId: input.lojaId,
    clienteId: input.clienteId || null,
    vendedorId: input.vendedorId,
    total: input.total,
    desconto: input.desconto || 0,
    metodoPagamento: input.metodoPagamento,
    status: 'pendente',
  });

  const savedVenda = await vRepo.save(venda);

  // Criar itens de venda e atualizar estoque
  const itens: ItemVenda[] = [];
  for (const item of input.itens) {
    const itemVenda = ivRepo.create({
      vendaId: savedVenda.id,
      produtoId: item.produtoId,
      quantidade: item.quantidade,
      precoUnitario: item.precoUnitario,
      subtotal: item.quantidade * item.precoUnitario,
    });

    const savedItem = await ivRepo.save(itemVenda);
    itens.push(savedItem);

    // Atualizar estoque (diminuir)
    await atualizarEstoque(item.produtoId, input.lojaId, -item.quantidade);
  }

  return { venda: savedVenda, itens };
}

export async function listarVendas(
  lojaId: number,
  page: number = 1,
  limit: number = 50,
  status?: string
): Promise<{ data: Venda[]; total: number }> {
  const repo = vendaRepo();
  const query = repo.createQueryBuilder('venda').where('venda.loja_id = :lojaId', { lojaId });

  if (status) {
    query.andWhere('venda.status = :status', { status });
  }

  const total = await query.getCount();
  const data = await query
    .skip((page - 1) * limit)
    .take(limit)
    .orderBy('venda.criado_em', 'DESC')
    .getMany();

  return { data, total };
}

export async function obterVenda(id: number, lojaId: number): Promise<Venda> {
  const repo = vendaRepo();
  const venda = await repo.findOne({ where: { id, lojaId } });

  if (!venda) {
    const error: any = new Error('Venda não encontrada');
    error.status = 404;
    throw error;
  }

  return venda;
}

export async function obterItensVenda(vendaId: number): Promise<ItemVenda[]> {
  const repo = itemVendaRepo();
  return repo.find({ where: { vendaId } });
}

export async function atualizarStatusVenda(
  id: number,
  lojaId: number,
  novoStatus: 'pendente' | 'concluida' | 'cancelada'
): Promise<Venda> {
  const repo = vendaRepo();
  const venda = await obterVenda(id, lojaId);

  // Se cancelando, devolver itens ao estoque
  if (novoStatus === 'cancelada' && venda.status !== 'cancelada') {
    const itens = await obterItensVenda(id);
    for (const item of itens) {
      await atualizarEstoque(item.produtoId, lojaId, item.quantidade);
    }
  }

  venda.status = novoStatus;
  return repo.save(venda);
}

export async function obterVendasPorCliente(
  lojaId: number,
  clienteId: number,
  page: number = 1,
  limit: number = 50
): Promise<{ data: Venda[]; total: number }> {
  const repo = vendaRepo();
  const query = repo
    .createQueryBuilder('venda')
    .where('venda.loja_id = :lojaId', { lojaId })
    .andWhere('venda.cliente_id = :clienteId', { clienteId });

  const total = await query.getCount();
  const data = await query
    .skip((page - 1) * limit)
    .take(limit)
    .orderBy('venda.criado_em', 'DESC')
    .getMany();

  return { data, total };
}

export async function obterTicketMedio(lojaId: number, dataInicio?: Date, dataFim?: Date): Promise<number> {
  const repo = vendaRepo();
  const query = repo
    .createQueryBuilder('venda')
    .where('venda.loja_id = :lojaId', { lojaId })
    .andWhere('venda.status = :status', { status: 'concluida' });

  if (dataInicio) {
    query.andWhere('venda.criado_em >= :dataInicio', { dataInicio });
  }

  if (dataFim) {
    query.andWhere('venda.criado_em <= :dataFim', { dataFim });
  }

  const vendas = await query.getMany();

  if (vendas.length === 0) return 0;

  const totalVendas = vendas.reduce((sum, v) => sum + parseFloat(v.total.toString()), 0);
  return totalVendas / vendas.length;
}
