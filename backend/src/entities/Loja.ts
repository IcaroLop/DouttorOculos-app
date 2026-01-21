import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lojas' })
export class Loja {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome!: string;

  @Column({ name: 'cnpj', type: 'varchar', length: 18, nullable: true, unique: true })
  cnpj?: string | null;

  @Column({ name: 'endereco', type: 'text', nullable: true })
  endereco?: string | null;

  @Column({ name: 'telefone', type: 'varchar', length: 20, nullable: true })
  telefone?: string | null;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
  email?: string | null;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm!: Date;
}
