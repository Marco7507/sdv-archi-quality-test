import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateOrderDto } from '../domain/entity/order.entity';

@Controller('/orders')
export default class OrderController {
  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto): string {
    return 'Order created';
  }
}
