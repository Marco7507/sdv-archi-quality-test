import { IsNotEmpty, Min } from 'class-validator';
import { Order } from '../entity/order.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('order-item')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productName: string;

  @Column({
    type: 'int',
  })
  quantity: number;

  @Column({
    type: 'int',
  })
  price: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  constructor(createOrderItemDto: CreateOrderItemDto) {
    if (
      !createOrderItemDto.productName ||
      !createOrderItemDto.quantity ||
      !createOrderItemDto.price
    ) {
      throw new Error('Invalid order item');
    }

    this.productName = createOrderItemDto.productName;
    this.quantity = createOrderItemDto.quantity;
    this.price = createOrderItemDto.price;
  }
}

export class CreateOrderItemDto {
  @IsNotEmpty()
  productName: string;

  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @Min(0)
  price: number;
}
