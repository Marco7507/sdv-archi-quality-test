import { BadRequestException } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { Order } from '../entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import OrderRepository from 'src/order/infrastructure/order.repository';

export class PayOrderDto {
  @IsNotEmpty()
  orderId: string;
}

export default class PayOrderService {
  @InjectRepository(Order)
  private readonly orderRepository: OrderRepository;

  async payOrder(payOrderDto: PayOrderDto): Promise<string> {
    const order = await this.orderRepository.findById(payOrderDto.orderId);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    order.pay();

    return 'Order paid';
  }
}
