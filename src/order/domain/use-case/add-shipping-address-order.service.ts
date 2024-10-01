import { IsNotEmpty } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entity/order.entity';
import OrderRepository from '../../infrastructure/order.repository';

export class AddShippingAddressDto {
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  shippingAddress: string;
}

export default class AddShippingAddressOrderService {
  @InjectRepository(Order)
  private readonly orderRepository: OrderRepository;

  async addShippingAddressOrder(addShippingAddressDto: AddShippingAddressDto) {
    const order = await this.orderRepository.findById(
      addShippingAddressDto.orderId,
    );
    if (!order) {
      throw new Error('Order not found');
    }

    order.addShippingAddress(addShippingAddressDto.shippingAddress);
    this.orderRepository.save(order);
  }
}
