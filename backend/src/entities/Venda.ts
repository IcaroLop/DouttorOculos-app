import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

type MetodoPagamentoEnum = 'dinheiro' | 'credito' | 'debito' | 'pix';
type StatusEnum = 'pendente' | 'concluida' | 'cancelada';

@Entity({ name: 'vendas' })
export class Venda {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'loja_id', type: 'int' })
  lojaId!: number;

  @Column({ name: 'cliente_id', type: 'int', nullable: true })
  clienteId?: number | null;

  @Column({ name: 'vendedor_id', type: 'int' })
  vendedorId!: number;

  @Column({ name: 'total', type: 'decimal', precision: 12, scale: 2 })
  total!: number;

  @Column({ name: 'desconto', type: 'decimal', precision: 12, scale: 2, default: 0 })
  desconto!: number;

  @Column({ name: 'metodo_pagamento', type: 'enum', enum: ['dinheiro', 'credito', 'debito', 'pix'] })
  metodoPagamento!: MetodoPagamentoEnum;

  @Column({ name: 'status', type: 'enum', enum: ['pendente', 'concluida', 'cancelada'], default: 'pendente' })
  status!: StatusEnum;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm!: Date;
}
