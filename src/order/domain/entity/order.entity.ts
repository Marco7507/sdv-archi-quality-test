import { OrderItem } from './order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
}
@Entity()
export class Order {
  static MIN_ORDER_ITEMS = 1;
  static MAX_ORDER_ITEMS = 5;
  static MIN_PRICE = 5;
  static MAX_PRICE = 500;

  @CreateDateColumn()
  @Expose({ groups: ['group_orders'] })
  private createdAt: Date;

  @PrimaryGeneratedColumn()
  @Expose({ groups: ['group_orders'] })
  private id: string;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  private price: number;

  @Column()
  @Expose({ groups: ['group_orders'] })
  private customerName: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    nullable: true,
  })
  @Expose({ groups: ['group_orders'] })
  private orderItems: OrderItem[];

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  private shippingAddress: string | null;

  private invoiceAddress: string | null;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  private shippingAddressSetAt: Date | null;

  @Column()
  @Expose({ groups: ['group_orders'] })
  private status: OrderStatus;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  private paidAt: Date | null;

  pay() {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Order already paid');
    }

    if (this.price > Order.MAX_PRICE) {
      throw new Error('Cannot pay order with price higher than 500');
    }

    this.status = OrderStatus.PAID;
    this.paidAt = new Date();
  }
}
