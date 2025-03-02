import { Entity, Column, OneToMany } from 'typeorm';
import { Order } from '../../../orders/order.schema';
import { BaseSchema } from '../../../../base/base.schema';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  refreshToken?: string;
  created_at: Date;
}

@Entity('Users')
export class User extends BaseSchema implements IUser {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken?: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
