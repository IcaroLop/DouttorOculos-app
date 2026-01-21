import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'receitas' })
export class Receita {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'loja_id', type: 'int' })
  lojaId!: number;

  @Column({ name: 'cliente_id', type: 'int' })
  clienteId!: number;

  @Column({ name: 'otico_id', type: 'int' })
  oticoId!: number;

  @Column({ name: 'data_receita', type: 'date' })
  dataReceita!: Date;

  // Olho Direito (OD)
  @Column({ name: 'esfera_od', type: 'decimal', precision: 5, scale: 2, nullable: true })
  esferaOd?: number | null;

  @Column({ name: 'cilindro_od', type: 'decimal', precision: 5, scale: 2, nullable: true })
  cilindroOd?: number | null;

  @Column({ name: 'eixo_od', type: 'int', nullable: true })
  eixoOd?: number | null;

  // Olho Esquerdo (OE)
  @Column({ name: 'esfera_oe', type: 'decimal', precision: 5, scale: 2, nullable: true })
  esferaOe?: number | null;

  @Column({ name: 'cilindro_oe', type: 'decimal', precision: 5, scale: 2, nullable: true })
  cilindroOe?: number | null;

  @Column({ name: 'eixo_oe', type: 'int', nullable: true })
  eixoOe?: number | null;

  // Dados adicionais
  @Column({ name: 'adicao', type: 'decimal', precision: 5, scale: 2, nullable: true })
  adicao?: number | null;

  @Column({ name: 'distancia_pupilar', type: 'int', nullable: true })
  distanciaPupilar?: number | null;

  @Column({ name: 'observacoes', type: 'text', nullable: true })
  observacoes?: string | null;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo!: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm!: Date;
}
