import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductType } from '../product-type/product-type.schema';

export interface IProduct {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
}

@Entity('Products')
export class Product implements IProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ProductType, (productType) => productType.product)
  productTypes: ProductType[];
}
