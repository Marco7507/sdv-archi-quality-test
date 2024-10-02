import { IsNotEmpty } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entity/order.entity';
import { OrderRepositoryInterface } from '../port/order.repository.interface';

export class ShipOrderDto {
  @IsNotEmpty()
  orderId: string;
}

export default class ShipOrderService {
  @InjectRepository(Order)
  private readonly orderRepository: OrderRepositoryInterface;

  async shipOrder(ShipOrderDto: ShipOrderDto): Promise<string> {
    const order = await this.orderRepository.findById(ShipOrderDto.orderId);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    order.ship();
    this.orderRepository.save(order);

    return 'Order shipped';
  }
}
