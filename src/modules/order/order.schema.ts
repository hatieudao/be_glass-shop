import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Customer } from '../customer/customer.schema';
import { OrderItem } from '../order-item/order-item.schema';

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export interface IOrder {
  id: number;
  customerId: number;
  status: OrderStatus;
  totalPrice: number;
  createdAt: Date;
}

@Entity('Orders')
export class Order implements IOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_id' })
  customerId: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
