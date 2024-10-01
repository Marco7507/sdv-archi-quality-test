import { Body, Controller, Get, Post } from '@nestjs/common';
import CreateOrderService, {
  CreateOrderDto,
} from '../domain/use-case/create-order.service';
import PayOrderService, {
  PayOrderDto,
} from '../domain/use-case/pay-order.service';
import ShipOrderService, {
  ShipOrderDto,
} from '../domain/use-case/ship-order.service';
import AddShippingAddressOrderService, {
  AddShippingAddressDto,
} from '../domain/use-case/add-shipping-address-order.service';
import { Order } from '../domain/entity/order.entity';
import AddInvoiceAddressOrderService, {
  AddInvoiceAddressDto,
} from '../domain/use-case/add-invoice-address-order.service';
import CancelOrderService, {
  CancelOrderDto,
} from '../domain/use-case/cancel-order.service';

@Controller('/orders')
export default class OrderController {
  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    const createOrderService = new CreateOrderService();

    return await createOrderService.createOrder(createOrderDto);
  }

  @Post('/pay')
  async payOrder(@Body() payOrderDto: PayOrderDto): Promise<string> {
    const payOrderService = new PayOrderService();
    await payOrderService.payOrder(payOrderDto);

    return 'Order paid';
  }

  @Post('/ship')
  async shipOrder(@Body() shipOrderDto: ShipOrderDto): Promise<string> {
    const shipOrderService = new ShipOrderService();
    await shipOrderService.shipOrder(shipOrderDto);
    return 'Order shipped';
  }

  @Post('/add-shipping-address')
  async addShippingAddress(
    @Body() addShippingAddressDto: AddShippingAddressDto,
  ): Promise<string> {
    const addShippingAddressOrderService = new AddShippingAddressOrderService();
    await addShippingAddressOrderService.addShippingAddressOrder(
      addShippingAddressDto,
    );
    return 'Shipping address added';
  }

  @Post('/add-invoice-address')
  async addInvoiceAddress(
    @Body() addInvoiceAddressDto: AddInvoiceAddressDto,
  ): Promise<string> {
    const addInvoiceAddressOrderService = new AddInvoiceAddressOrderService();
    await addInvoiceAddressOrderService.addInvoiceAddressOrder(
      addInvoiceAddressDto,
    );
    return 'Invoice address added';
  }

  @Post('/cancel')
  async cancelOrder(@Body() cancelOrderDto: CancelOrderDto): Promise<string> {
    const cancelOrderService = new CancelOrderService();
    await cancelOrderService.cancelOrder(cancelOrderDto);
    return 'Order cancelled';
  }
}
