import { Entity, Column, OneToMany } from 'typeorm';
import { Order } from '../../../orders/order.schema';
import { BaseSchema } from '../../../../base/base.schema';

export interface ICustomer {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  refreshToken?: string;
  activateCode?: string;
  isActivated?: boolean;
  created_at: Date;
}

@Entity('Customers')
export class Customer extends BaseSchema implements ICustomer {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken?: string;

  @Column({ name: 'activate_code', nullable: true })
  activateCode?: string;

  @Column({ name: 'is_activated', default: false })
  isActivated?: boolean;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
