import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'usuarios' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'loja_id', type: 'int', nullable: true })
  lojaId!: number | null;

  @Column({ name: 'portal', type: 'varchar', length: 100 })
  portal!: string;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome!: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email!: string;

  @Column({ name: 'username', type: 'varchar', length: 100 })
  username!: string;

  @Column({ name: 'senha_hash', type: 'varchar', length: 255 })
  senhaHash!: string;

  @Column({ name: 'cargo', type: 'enum', enum: ['gerente', 'vendedor', 'otico', 'atendente', 'admin'], default: 'admin' })
  cargo!: 'gerente' | 'vendedor' | 'otico' | 'atendente' | 'admin';

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo!: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm!: Date;
}
