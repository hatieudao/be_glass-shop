import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from '../orders/order.schema';
import { ProductType } from '../product-types/product-type.schema';

export interface IOrderItem {
  id: number;
  orderId: number;
  productTypeId: number;
  quantity: number;
  price: number;
}

@Entity('OrderItems')
export class OrderItem implements IOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'product_type_id' })
  productTypeId: number;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @ManyToOne(() => ProductType, (productType) => productType.orderItems)
  productType: ProductType;
}
