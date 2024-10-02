import { IsNotEmpty } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entity/order.entity';
import { OrderRepositoryInterface } from '../port/order.repository.interface';

export class AddInvoiceAddressDto {
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  invoiceAddress: string;
}

export default class AddInvoiceAddressOrderService {
  @InjectRepository(Order)
  private readonly orderRepository: OrderRepositoryInterface;

  async addInvoiceAddressOrder(addShippingAddressDto: AddInvoiceAddressDto) {
    const order = await this.orderRepository.findById(
      addShippingAddressDto.orderId,
    );
    if (!order) {
      throw new Error('Order not found');
    }

    order.addInvoiceAddress(addShippingAddressDto.invoiceAddress);

    this.orderRepository.save(order);
  }
}
