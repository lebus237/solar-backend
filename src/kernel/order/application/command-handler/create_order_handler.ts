import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CreateOrderCommand } from '#kernel/order/application/command/create_order_command'
import { OrderRepository } from '#kernel/order/domain/repository/order_repository'
import { CustomerRepository } from '#kernel/customer/domain/repository/customer_repository'
import { AddressRepository } from '#kernel/customer/domain/repository/address_repository'
import { ProductRepository } from '#kernel/product/domain/repository/product_repository'
import { Order } from '#kernel/order/domain/entity/order'
import { OrderItem } from '#kernel/order/domain/entity/order_item'
import { OrderStatus } from '#kernel/order/domain/type/order_status'
import { DateTime } from 'luxon'
import { asCustomerId, asAddressId, asProductId } from '#shared/domain/types/branded_types'

export class CreateOrderHandler implements CommandHandler<CreateOrderCommand, string> {
  constructor(
    private orderRepository: OrderRepository,
    private customerRepository: CustomerRepository,
    private addressRepository: AddressRepository,
    private productRepository: ProductRepository
  ) {}

  async handle(command: CreateOrderCommand): Promise<string> {
    // Get customer
    const customer = await this.customerRepository.findById(asCustomerId(command.customerId))

    // Get shipping address
    const shippingAddress = await this.addressRepository.findById(
      asAddressId(command.shippingAddressId)
    )

    // Get products and calculate totals
    let subtotal = 0
    const orderItems: OrderItem[] = []

    for (const item of command.items) {
      const product = await this.productRepository.find(asProductId(item.productId))
      const unitPrice = product['price']
      const totalPrice = unitPrice * item.quantity
      subtotal += totalPrice

      const orderItem = new OrderItem(
        null,
        '', // Will be set when order is saved
        product.getId(),
        product['designation'],
        product.getSlug() || null,
        item.quantity,
        unitPrice,
        totalPrice
      )
      orderItems.push(orderItem)
    }

    // Calculate shipping fee (can be customized based on business logic)
    const shippingFee = 0 // Free shipping for now
    const total = subtotal + shippingFee

    // Generate order number
    const orderNumber = await this.generateOrderNumber()

    // Create order
    const order = new Order(
      null,
      orderNumber,
      customer.getId(),
      OrderStatus.PENDING,
      customer.getFirstName(),
      customer.getLastName(),
      customer.getPhone(),
      shippingAddress.getAddressLine1(),
      shippingAddress.getAddressLine2(),
      shippingAddress.getCity(),
      shippingAddress.getState(),
      shippingAddress.getPostalCode(),
      shippingAddress.getCountry(),
      subtotal,
      shippingFee,
      total,
      command.customerNotes || null,
      null,
      orderItems
    )

    await this.orderRepository.save(order)

    return orderNumber
  }

  private async generateOrderNumber(): Promise<string> {
    const now = DateTime.now()
    const dateStr = now.toFormat('yyyyMMdd')
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `ORD-${dateStr}-${randomStr}`
  }
}
