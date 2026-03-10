import { OrderRepository } from '#kernel/order/domain/repository/order_repository'
import { default as EntityActiveRecord } from '#database/active-records/order'
import OrderItemActiveRecord from '#database/active-records/order_item'
import { Order } from '#kernel/order/domain/entity/order'
import { OrderItem } from '#kernel/order/domain/entity/order_item'
import { OrderStatus } from '#kernel/order/domain/type/order_status'
import db from '@adonisjs/lucid/services/db'
import { OrderId, CustomerId, asOrderId, asCustomerId } from '#shared/domain/types/branded_types'
import { DateTime } from 'luxon'

export class OrderARRepository implements OrderRepository {
  async findById(id: OrderId): Promise<Order> {
    const order = await EntityActiveRecord.query().where('id', id).preload('items').firstOrFail()
    return this.mapToEntity(order)
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const order = await EntityActiveRecord.query()
      .where('order_number', orderNumber)
      .preload('items')
      .first()
    if (!order) {
      return null
    }
    return this.mapToEntity(order)
  }

  async findByCustomerId(
    customerId: CustomerId,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: Order[]
    meta: { total: number; perPage: number; currentPage: number; lastPage: number }
  }> {
    const result = await EntityActiveRecord.query()
      .where('customer_id', customerId)
      .preload('items')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    const paginatedResult = result.toJSON()
    const orders = paginatedResult.data.map((order) => this.mapToEntity(order as any))

    return {
      data: orders,
      meta: paginatedResult.meta,
    }
  }

  async findByStatus(
    status: OrderStatus,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: Order[]
    meta: { total: number; perPage: number; currentPage: number; lastPage: number }
  }> {
    const result = await EntityActiveRecord.query()
      .where('status', status)
      .preload('items')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    const paginatedResult = result.toJSON()
    const orders = paginatedResult.data.map((order) => this.mapToEntity(order as any))

    return {
      data: orders,
      meta: paginatedResult.meta,
    }
  }

  async save(entity: Order): Promise<void> {
    const object = {
      orderNumber: entity.getOrderNumber(),
      customerId: entity.getCustomerId(),
      status: entity.getStatus(),
      shippingFirstName: entity.getShippingFirstName(),
      shippingLastName: entity.getShippingLastName(),
      shippingPhone: entity.getShippingPhone(),
      shippingAddressLine1: entity.getShippingAddressLine1(),
      shippingAddressLine2: entity.getShippingAddressLine2(),
      shippingCity: entity.getShippingCity(),
      shippingState: entity.getShippingState(),
      shippingPostalCode: entity.getShippingPostalCode(),
      shippingCountry: entity.getShippingCountry(),
      subtotal: entity.getSubtotal(),
      shippingFee: entity.getShippingFee(),
      total: entity.getTotal(),
      customerNotes: entity.getCustomerNotes(),
      adminNotes: entity.getAdminNotes(),
      confirmedAt: entity.getConfirmedAt(),
      shippedAt: entity.getShippedAt(),
      deliveredAt: entity.getDeliveredAt(),
      cancelledAt: entity.getCancelledAt(),
    }

    const trx = await db.transaction()

    try {
      let orderRecord: EntityActiveRecord

      if (entity.getId()) {
        orderRecord = await EntityActiveRecord.updateOrCreate(
          { id: entity.getId() as any },
          object as any,
          {
            client: trx,
          }
        )
      } else {
        orderRecord = await EntityActiveRecord.create(object as any, { client: trx })
      }

      // Save order items
      const items = entity.getItems()
      if (items.length > 0) {
        // Delete existing items
        await OrderItemActiveRecord.query({ client: trx })
          .where('order_id', orderRecord.id)
          .delete()

        // Insert new items
        for (const item of items) {
          await OrderItemActiveRecord.create(
            {
              orderId: orderRecord.id,
              productId: item.getProductId() as any,
              productName: item.getProductName(),
              productSlug: item.getProductSlug(),
              quantity: item.getQuantity(),
              unitPrice: item.getUnitPrice(),
              totalPrice: item.getTotalPrice(),
            },
            { client: trx }
          )
        }
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async delete(id: OrderId): Promise<void> {
    const order = await EntityActiveRecord.findOrFail(id)
    await order.delete()
  }

  async findAll(): Promise<Order[]> {
    const orders = await EntityActiveRecord.query().preload('items')
    return orders.map((order) => this.mapToEntity(order))
  }

  private mapToEntity(order: EntityActiveRecord): Order {
    // Use preloaded items instead of separate query
    const orderItems = order.items || []

    const items: OrderItem[] = orderItems.map((item) => {
      return new OrderItem(
        item.id,
        item.orderId ?? '',
        item.productId ?? null,
        item.productName,
        item.productSlug,
        item.quantity,
        item.unitPrice,
        item.totalPrice,
        this.toDate(item.createdAt)
      )
    })

    return new Order(
      asOrderId(order.id),
      order.orderNumber,
      order.customerId ? asCustomerId(order.customerId) : null,
      order.status as OrderStatus,
      order.shippingFirstName,
      order.shippingLastName,
      order.shippingPhone,
      order.shippingAddressLine1,
      order.shippingAddressLine2,
      order.shippingCity,
      order.shippingState,
      order.shippingPostalCode,
      order.shippingCountry,
      order.subtotal,
      order.shippingFee,
      order.total,
      order.customerNotes,
      order.adminNotes,
      items,
      this.toDate(order.confirmedAt),
      this.toDate(order.shippedAt),
      this.toDate(order.deliveredAt),
      this.toDate(order.cancelledAt),
      this.toDate(order.createdAt),
      this.toDate(order.updatedAt)
    )
  }

  private toDate(dateTime: DateTime | null | undefined): Date | undefined {
    if (!dateTime) return undefined
    return dateTime.toJSDate()
  }
}
