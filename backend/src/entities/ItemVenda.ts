import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'itens_venda' })
export class ItemVenda {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'venda_id', type: 'int' })
  vendaId!: number;

  @Column({ name: 'produto_id', type: 'int' })
  produtoId!: number;

  @Column({ name: 'quantidade', type: 'int' })
  quantidade!: number;

  @Column({ name: 'preco_unitario', type: 'decimal', precision: 10, scale: 2 })
  precoUnitario!: number;

  @Column({ name: 'subtotal', type: 'decimal', precision: 12, scale: 2 })
  subtotal!: number;
}
