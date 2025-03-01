import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from '../order/order.schema';

export interface ICustomer {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  createdAt: Date;
}

@Entity('Customers')
export class Customer implements ICustomer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
