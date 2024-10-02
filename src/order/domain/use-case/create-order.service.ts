import { Order } from '../entity/order.entity';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from '../entity/order-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepositoryInterface } from '../port/order.repository.interface';

export class CreateOrderDto {
  @IsNotEmpty()
  customerName: string;

  @IsNotEmpty()
  @Min(Order.MIN_PRICE)
  price: number;

  @IsNotEmpty()
  shippingAddress: string;

  @IsNotEmpty()
  @ArrayMinSize(Order.MIN_ORDER_ITEMS)
  @ArrayMaxSize(Order.MAX_ORDER_ITEMS)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}

export default class CreateOrderService {
  @InjectRepository(Order)
  private readonly orderRepository: OrderRepositoryInterface;

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new Order(createOrderDto);

    await this.orderRepository.save(order);

    return order;
  }
}
