import { OrderItem } from './order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { CreateOrderDto } from '../use-case/create-order.service';
import { BadRequestException } from '@nestjs/common';

enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
@Entity()
export class Order {
  static MIN_ORDER_ITEMS = 1;
  static MAX_ORDER_ITEMS = 5;
  static MIN_PRICE = 5;
  static MAX_PRICE = 500;
  static SHIPPING_COST = 5;
  static MIN_SHIPPING_ITEMS = 3;

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
  orderItems: OrderItem[];

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

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  private cancellationReason: string | null;

  @Column()
  @Expose({ groups: ['group_orders'] })
  private cancelSetAt: Date | null;

  public constructor(createOrderDto: CreateOrderDto) {
    if (
      !createOrderDto.customerName ||
      !createOrderDto.orderItems ||
      !createOrderDto.price ||
      createOrderDto.orderItems.length < Order.MIN_ORDER_ITEMS ||
      createOrderDto.orderItems.length > Order.MAX_ORDER_ITEMS ||
      createOrderDto.price < Order.MIN_PRICE ||
      createOrderDto.price > Order.MAX_PRICE
    ) {
      throw new Error('Invalid order');
    }

    const total = this.calculateTotalPrice(createOrderDto.orderItems);

    if (total < Order.MIN_PRICE) {
      throw new BadRequestException('Order price is too low');
    }

    this.customerName = createOrderDto.customerName;
    this.orderItems = createOrderDto.orderItems.map(
      (orderItemDto) => new OrderItem(orderItemDto),
    );
    this.price = createOrderDto.price;
    this.status = OrderStatus.PENDING;
  }

  private calculateTotalPrice(orderItems) {
    return orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
  }

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

  ship() {
    if (this.status !== OrderStatus.PAID) {
      throw new Error('Order not paid');
    }
    if (!this.shippingAddress) {
      throw new Error('Shipping address not set');
    }

    this.status = OrderStatus.SHIPPED;
    this.shippingAddressSetAt = new Date();
  }

  addShippingAddress(address: string) {
    if (!address) {
      throw new Error('Address is required');
    }
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Order must be pending');
    }
    if (this.orderItems.length < Order.MIN_SHIPPING_ITEMS) {
      throw new Error('Order must have at least 1 item');
    }
    if (!this.price) {
      throw new Error('Order price not set');
    }

    if (!this.shippingAddress) {
      this.price += Order.SHIPPING_COST;
    }

    this.shippingAddress = address;
    this.shippingAddressSetAt = new Date();
    this.invoiceAddress = address;
  }

  addInvoiceAddress(invoiceAddress: string) {
    if (!invoiceAddress) {
      throw new Error('Address is required');
    }
    if (!this.shippingAddress) {
      throw new Error('Shipping address not set');
    }
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Order must be pending');
    }
    if (!this.price) {
      throw new Error('Order price not set');
    }

    this.invoiceAddress = invoiceAddress;
  }

  cancel(cancellationReason: string) {
    if (!cancellationReason) {
      throw new Error('Cancellation reason is required');
    }
    if (
      this.status === OrderStatus.DELIVERED ||
      this.status === OrderStatus.SHIPPED
    ) {
      throw new Error('Cannot cancel delivered or shipped order');
    }

    this.status = OrderStatus.CANCELLED;
    this.cancelSetAt = new Date();
    this.cancellationReason = cancellationReason;
  }
}
