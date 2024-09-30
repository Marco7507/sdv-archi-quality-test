import { CreateOrderDto } from '../entity/order.entity';

export default class CreateOrderService {
  createOrder(createOrderDto: CreateOrderDto): string {
    const total = this.calculateTotalPrice(createOrderDto.orderItems);

    if (total !== createOrderDto.price) {
      throw new Error('Total price does not match');
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
