import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { CreateOrderDto } from '../domain/entity/order.entity';

@Controller('/orders')
export default class OrderController {
  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto): string {
    const total = this.calculateTotalPrice(createOrderDto.orderItems);

    if (total !== createOrderDto.price) {
      throw new BadRequestException('Total price does not match');
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
