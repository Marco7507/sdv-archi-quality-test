import { BadRequestException } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { Order } from '../entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepositoryInterface } from '../port/order.repository.interface';

export class PayOrderDto {
  @IsNotEmpty()
  orderId: string;
}

export default class PayOrderService {
  @InjectRepository(Order)
  private readonly orderRepository: OrderRepositoryInterface;

  async payOrder(payOrderDto: PayOrderDto): Promise<string> {
    const order = await this.orderRepository.findById(payOrderDto.orderId);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    order.pay();

    this.orderRepository.save(order);

    return 'Order paid';
  }
}
