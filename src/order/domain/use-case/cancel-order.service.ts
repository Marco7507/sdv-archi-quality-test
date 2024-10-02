import { IsNotEmpty } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entity/order.entity';
import { OrderRepositoryInterface } from '../port/order.repository.interface';

export class CancelOrderDto {
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  reason: string;
}

export default class CancelOrderService {
  @InjectRepository(Order)
  private readonly orderRepository: OrderRepositoryInterface;

  async cancelOrder(cancelOrderDto: CancelOrderDto): Promise<string> {
    const order = await this.orderRepository.findById(cancelOrderDto.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.cancel(cancelOrderDto.reason);
    this.orderRepository.save(order);

    return 'Order cancelled';
  }
}
