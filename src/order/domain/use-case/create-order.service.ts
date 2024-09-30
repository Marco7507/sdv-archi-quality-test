import { BadRequestException } from '@nestjs/common';
import { Order } from '../entity/order.entity';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  Min,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
} from 'class-validator';
import { createOrderItemDto } from '../entity/order-item.entity';

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
  @Type(() => createOrderItemDto)
  orderItems: createOrderItemDto[];
}

export default class CreateOrderService {
  createOrder(createOrderDto: CreateOrderDto): string {
    const total = this.calculateTotalPrice(createOrderDto.orderItems);

    if (total < Order.MIN_PRICE) {
      throw new BadRequestException('Order price is too low');
    }

    return 'Order created';
  }

  calculateTotalPrice(orderItems) {
    return orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
  }
}
