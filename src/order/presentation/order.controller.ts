import { Body, Controller, Get, Post } from '@nestjs/common';
import CreateOrderService, { CreateOrderDto } from '../domain/use-case/create-order.service';
import PayOrderService, { PayOrderDto } from '../domain/use-case/pay-order.service';

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

  @Post('/pay')
  payOrder(@Body() payOrderDto: PayOrderDto): string {
    const payOrderService = new PayOrderService();
    payOrderService.payOrder(payOrderDto);

    return 'Order paid';
  }
}
