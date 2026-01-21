import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'clientes' })
export class Cliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'loja_id', type: 'int' })
  lojaId!: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome!: string;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
  email?: string | null;

  @Column({ name: 'telefone', type: 'varchar', length: 20 })
  telefone!: string;

  @Column({ name: 'cpf', type: 'varchar', length: 14, unique: true })
  cpf!: string;

  @Column({ name: 'data_nascimento', type: 'date', nullable: true })
  dataNascimento?: Date | null;

  @Column({ name: 'endereco', type: 'text', nullable: true })
  endereco?: string | null;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo!: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm!: Date;
}
