import { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { CreateOrderCommand } from '#kernel/order/application/command/create_order_command'
import { UpdateOrderStatusCommand } from '#kernel/order/application/command/update_order_status_command'
import { CancelOrderCommand } from '#kernel/order/application/command/cancel_order_command'
import { ListOrdersQuery } from '#kernel/order/application/query/list_orders_query'
import { GetOrderQuery } from '#kernel/order/application/query/get_order_query'
import { GetOrderByNumberQuery } from '#kernel/order/application/query/get_order_by_number_query'
import { ListCustomerOrdersQuery } from '#kernel/order/application/query/list_customer_orders_query'
import { OrderStatus } from '#kernel/order/domain/type/order_status'
import { Order } from '#kernel/order/domain/entity/order'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import {
  createOrderSchema,
  updateOrderStatusSchema,
  cancelOrderSchema,
} from '#validators/order_validator'

export default class OrderController extends AppAbstractController {
  /**
   * list all orders (with optional status filter)
   */
  async index({ request, response }: HttpContext) {
    const status = request.input('status') as OrderStatus | undefined
    const orders = await this.handleQuery<Order[]>(new ListOrdersQuery(status))

    return response.ok({
      status: 'success',
      data: orders.map((o) => this.serializeOrder(o)),
    })
  }

  /**
   * Get a single order by ID
   */
  async show({ params, response }: HttpContext) {
    const order = await this.handleQuery<Order>(new GetOrderQuery(params.id))
    return response.ok({
      status: 'success',
      data: this.serializeOrder(order),
    })
  }

  /**
   * Get order by order number
   */
  async findByOrderNumber({ params, response }: HttpContext) {
    const order = await this.handleQuery<Order | null>(
      new GetOrderByNumberQuery(params.orderNumber)
    )
    if (!order) {
      return response.notFound({ status: 'error', message: 'Order not found' })
    }
    return response.ok({
      status: 'success',
      data: this.serializeOrder(order),
    })
  }

  /**
   * Create a new order
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createOrderSchema)

    const command = new CreateOrderCommand(
      payload.customerId,
      payload.items.map((item: { productId: string; quantity: number }) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      payload.shippingAddressId,
      payload.customerNotes || undefined
    )

    const orderNumber = await this.handleCommand<string>(command)

    return response.created({
      status: 'success',
      message: 'Order created successfully',
      data: { orderNumber: orderNumber },
    })
  }

  /**
   * Update order status (admin only)
   */
  async updateStatus({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateOrderStatusSchema)

    const command = new UpdateOrderStatusCommand(
      params.id,
      payload.status as OrderStatus,
      payload.adminNotes || undefined
    )

    await this.handleCommand(command)

    return response.ok({
      status: 'success',
      message: 'Order status updated successfully',
    })
  }

  /**
   * Cancel an order
   */
  async cancel({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(cancelOrderSchema)

    const command = new CancelOrderCommand(params.id, payload.reason || undefined)

    await this.handleCommand(command)

    return response.ok({
      status: 'success',
      message: 'Order cancelled successfully',
    })
  }

  /**
   * Get orders by customer
   */
  async byCustomer({ params, response }: HttpContext) {
    const result = await this.handleQuery<PaginatedResultDto<Order>>(
      new ListCustomerOrdersQuery(params.customerId)
    )
    return response.ok({
      status: 'success',
      data: result.data.map((o) => this.serializeOrder(o)),
      meta: result.meta,
    })
  }

  private serializeOrder(order: Order) {
    return {
      id: order.getId()?.value ?? null,
      orderNumber: order.getOrderNumber(),
      customerId: order.getCustomerId()?.value ?? null,
      status: order.getStatus(),
      customerFirstName: order.getShippingFirstName(),
      customerLastName: order.getShippingLastName(),
      customerPhone: order.getShippingPhone(),
      shippingAddressLine1: order.getShippingAddressLine1(),
      shippingAddressLine2: order.getShippingAddressLine2(),
      shippingCity: order.getShippingCity(),
      shippingState: order.getShippingState(),
      shippingPostalCode: order.getShippingPostalCode(),
      shippingCountry: order.getShippingCountry(),
      subtotal: order.getSubtotal(),
      shippingFee: order.getShippingFee(),
      total: order.getTotal(),
      customerNotes: order.getCustomerNotes(),
      adminNotes: order.getAdminNotes(),
      confirmedAt: order.getConfirmedAt(),
      shippedAt: order.getShippedAt(),
      deliveredAt: order.getDeliveredAt(),
      cancelledAt: order.getCancelledAt(),
      createdAt: order.getCreatedAt(),
      updatedAt: order.getUpdatedAt(),
      items: order.getItems()?.map((item) => ({
        id: item.getId()?.value ?? null,
        productId: item.getProductId()?.value ?? null,
        productName: item.getProductName(),
        productSlug: item.getProductSlug(),
        quantity: item.getQuantity(),
        unitPrice: item.getUnitPrice(),
        totalPrice: item.getTotalPrice(),
      })),
    }
  }
}
