import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Receita } from '../entities/Receita';

const receitaRepo = (): Repository<Receita> => AppDataSource.getRepository(Receita);

export type CreateReceitaInput = {
  lojaId: number;
  clienteId: number;
  oticoId: number;
  dataReceita: Date;
  esferaOd?: number | null;
  cilindroOd?: number | null;
  eixoOd?: number | null;
  esferaOe?: number | null;
  cilindroOe?: number | null;
  eixoOe?: number | null;
  adicao?: number | null;
  distanciaPupilar?: number | null;
  observacoes?: string | null;
};

export type UpdateReceitaInput = Partial<CreateReceitaInput>;

export async function criarReceita(input: CreateReceitaInput): Promise<Receita> {
  const repo = receitaRepo();

  const receita = repo.create({
    lojaId: input.lojaId,
    clienteId: input.clienteId,
    oticoId: input.oticoId,
    dataReceita: input.dataReceita,
    esferaOd: input.esferaOd || null,
    cilindroOd: input.cilindroOd || null,
    eixoOd: input.eixoOd || null,
    esferaOe: input.esferaOe || null,
    cilindroOe: input.cilindroOe || null,
    eixoOe: input.eixoOe || null,
    adicao: input.adicao || null,
    distanciaPupilar: input.distanciaPupilar || null,
    observacoes: input.observacoes || null,
    ativo: true,
  });

  return repo.save(receita);
}

export async function listarReceitasCliente(
  lojaId: number,
  clienteId: number,
  page: number = 1,
  limit: number = 50
): Promise<{ data: Receita[]; total: number }> {
  const repo = receitaRepo();
  const query = repo
    .createQueryBuilder('receita')
    .where('receita.loja_id = :lojaId', { lojaId })
    .andWhere('receita.cliente_id = :clienteId', { clienteId })
    .andWhere('receita.ativo = true');

  const total = await query.getCount();
  const data = await query
    .skip((page - 1) * limit)
    .take(limit)
    .orderBy('receita.data_receita', 'DESC')
    .getMany();

  return { data, total };
}

export async function obterReceita(id: number, lojaId: number): Promise<Receita> {
  const repo = receitaRepo();
  const receita = await repo.findOne({ where: { id, lojaId, ativo: true } });

  if (!receita) {
    const error: any = new Error('Receita não encontrada');
    error.status = 404;
    throw error;
  }

  return receita;
}

export async function atualizarReceita(id: number, lojaId: number, input: UpdateReceitaInput): Promise<Receita> {
  const repo = receitaRepo();
  const receita = await obterReceita(id, lojaId);

  Object.assign(receita, input);
  return repo.save(receita);
}

export async function deletarReceita(id: number, lojaId: number): Promise<void> {
  const repo = receitaRepo();
  const receita = await obterReceita(id, lojaId);

  // Soft delete
  receita.ativo = false;
  await repo.save(receita);
}

export async function verificarReceitaValida(id: number, lojaId: number): Promise<boolean> {
  const receita = await obterReceita(id, lojaId);

  const hoje = new Date();
  const dataVencimento = new Date(receita.criadoEm);
  dataVencimento.setFullYear(dataVencimento.getFullYear() + 1);

  return hoje <= dataVencimento;
}

export async function obterReceitasProximasAoVencimento(lojaId: number, diasAntecedencia: number = 30): Promise<Receita[]> {
  const repo = receitaRepo();
  const hoje = new Date();
  const dataLimite = new Date(hoje);
  dataLimite.setDate(dataLimite.getDate() + diasAntecedencia);

  const umAnoAtras = new Date(hoje);
  umAnoAtras.setFullYear(umAnoAtras.getFullYear() - 1);

  return repo.find({
    where: {
      lojaId,
      ativo: true,
    },
  }).then((receitas) =>
    receitas.filter((r) => {
      const dataVencimento = new Date(r.criadoEm);
      dataVencimento.setFullYear(dataVencimento.getFullYear() + 1);
      return dataVencimento >= hoje && dataVencimento <= dataLimite;
    })
  );
}
