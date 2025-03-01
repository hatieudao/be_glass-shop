import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Product } from '../products/product.schema';
import { OrderItem } from '../order-items/order-item.schema';

export interface IProductType {
  id: number;
  productId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: Date;
}

@Entity('ProductTypes')
export class ProductType implements IProductType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Product, (product) => product.productTypes)
  product: Product;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.productType)
  orderItems: OrderItem[];
}
