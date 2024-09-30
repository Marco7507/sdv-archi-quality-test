import { BadRequestException } from '@nestjs/common';
import { CreateOrderDto, Order } from '../entity/order.entity';

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
