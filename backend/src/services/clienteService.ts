import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Cliente } from '../entities/Cliente';

const clienteRepo = (): Repository<Cliente> => AppDataSource.getRepository(Cliente);

export type CreateClienteInput = {
  lojaId: number;
  nome: string;
  cpf: string;
  telefone: string;
  email?: string | null;
  dataNascimento?: Date | null;
  endereco?: string | null;
};

export type UpdateClienteInput = Partial<CreateClienteInput>;

export async function criarCliente(input: CreateClienteInput): Promise<Cliente> {
  const repo = clienteRepo();

  // Validar CPF único
  const existing = await repo.findOne({ where: { cpf: input.cpf } });
  if (existing) {
    const error: any = new Error('CPF já cadastrado no sistema');
    error.status = 400;
    throw error;
  }

  const cliente = repo.create({
    lojaId: input.lojaId,
    nome: input.nome,
    cpf: input.cpf,
    telefone: input.telefone,
    email: input.email || null,
    dataNascimento: input.dataNascimento || null,
    endereco: input.endereco || null,
    ativo: true,
  });

  return repo.save(cliente);
}

export async function listarClientes(
  lojaId: number,
  page: number = 1,
  limit: number = 50,
  ativo?: boolean
): Promise<{ data: Cliente[]; total: number }> {
  const repo = clienteRepo();
  const query = repo.createQueryBuilder('cliente').where('cliente.loja_id = :lojaId', { lojaId });

  if (ativo !== undefined) {
    query.andWhere('cliente.ativo = :ativo', { ativo });
  }

  const total = await query.getCount();
  const data = await query.skip((page - 1) * limit).take(limit).orderBy('cliente.criado_em', 'DESC').getMany();

  return { data, total };
}

export async function obterCliente(id: number, lojaId: number): Promise<Cliente> {
  const repo = clienteRepo();
  const cliente = await repo.findOne({ where: { id, lojaId } });

  if (!cliente) {
    const error: any = new Error('Cliente não encontrado');
    error.status = 404;
    throw error;
  }

  return cliente;
}

export async function atualizarCliente(id: number, lojaId: number, input: UpdateClienteInput): Promise<Cliente> {
  const repo = clienteRepo();
  const cliente = await obterCliente(id, lojaId);

  // Validar CPF único (se alterado)
  if (input.cpf && input.cpf !== cliente.cpf) {
    const existing = await repo.findOne({ where: { cpf: input.cpf } });
    if (existing) {
      const error: any = new Error('CPF já cadastrado no sistema');
      error.status = 400;
      throw error;
    }
  }

  Object.assign(cliente, input);
  return repo.save(cliente);
}

export async function deletarCliente(id: number, lojaId: number): Promise<void> {
  const repo = clienteRepo();
  const cliente = await obterCliente(id, lojaId);

  // Soft delete
  cliente.ativo = false;
  await repo.save(cliente);
}
