import { IsNotEmpty } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entity/order.entity';
import OrderRepository from '../../infrastructure/order.repository';

export class CancelOrderDto {
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  reason: string;
}

export default class CancelOrderService {
  @InjectRepository(Order)
  private readonly orderRepository: OrderRepository;

  async cancelOrder(cancelOrderDto: CancelOrderDto): Promise<string> {
    const order = await this.orderRepository.findById(cancelOrderDto.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.cancel(cancelOrderDto.reason);

    return 'Order cancelled';
  }
}
