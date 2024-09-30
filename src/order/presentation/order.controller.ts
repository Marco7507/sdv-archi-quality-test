import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateOrderDto } from '../domain/entity/order.entity';
import CreateOrderService from '../domain/use-case/create-order.service';

@Controller('/orders')
export default class OrderController {
  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto): string {
    const createOrderService = new CreateOrderService();

    createOrderService.createOrder(createOrderDto);

    return 'Order created';
  }
}
