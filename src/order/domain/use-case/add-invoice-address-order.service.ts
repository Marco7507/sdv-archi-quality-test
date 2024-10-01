import { IsNotEmpty } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entity/order.entity';
import OrderRepository from '../../infrastructure/order.repository';

export class AddInvoiceAddressDto {
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  invoiceAddress: string;
}

export default class AddInvoiceAddressOrderService {
  @InjectRepository(Order)
  private readonly orderRepository: OrderRepository;

  async addInvoiceAddressOrder(addShippingAddressDto: AddInvoiceAddressDto) {
    const order = await this.orderRepository.findById(
      addShippingAddressDto.orderId,
    );
    if (!order) {
      throw new Error('Order not found');
    }

    order.addInvoiceAddress(addShippingAddressDto.invoiceAddress);
  }
}
