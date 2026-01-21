import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

type CategoriaEnum = 'armacao' | 'lente' | 'solucao' | 'acessorio';

@Entity({ name: 'produtos' })
export class Produto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'loja_id', type: 'int' })
  lojaId!: number;

  @Column({ name: 'codigo_sku', type: 'varchar', length: 50, unique: true })
  codigoSku!: string;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome!: string;

  @Column({ name: 'descricao', type: 'text', nullable: true })
  descricao?: string | null;

  @Column({ name: 'categoria', type: 'enum', enum: ['armacao', 'lente', 'solucao', 'acessorio'] })
  categoria!: CategoriaEnum;

  @Column({ name: 'preco_custo', type: 'decimal', precision: 10, scale: 2, nullable: true })
  precoCusto?: number | null;

  @Column({ name: 'preco_venda', type: 'decimal', precision: 10, scale: 2 })
  precoVenda!: number;

  @Column({ name: 'estoque', type: 'int', default: 0 })
  estoque!: number;

  @Column({ name: 'estoque_minimo', type: 'int', default: 5 })
  estoqueMinimo!: number;

  @Column({ name: 'imagem_url', type: 'varchar', length: 500, nullable: true })
  imagemUrl?: string | null;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo!: boolean;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm!: Date;
}
