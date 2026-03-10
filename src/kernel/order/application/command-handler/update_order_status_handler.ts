import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { UpdateOrderStatusCommand } from '#kernel/order/application/command/update_order_status_command'
import { OrderRepository } from '#kernel/order/domain/repository/order_repository'
import { canTransitionTo } from '#kernel/order/domain/type/order_status'
import { asOrderId } from '#shared/domain/types/branded_types'
import { OrderStatusTransitionError } from '#kernel/order/domain/errors/order_status_transition_error'

export class UpdateOrderStatusHandler implements CommandHandler<UpdateOrderStatusCommand> {
  constructor(private orderRepository: OrderRepository) {}

  async handle(command: UpdateOrderStatusCommand): Promise<void> {
    const order = await this.orderRepository.findById(asOrderId(command.orderId))

    // Validate status transition
    if (!canTransitionTo(order.getStatus(), command.status)) {
      throw new OrderStatusTransitionError(order.getStatus(), command.status)
    }

    // Update status
    order.setStatus(command.status)

    // Update admin notes if provided
    if (command.adminNotes) {
      order.setAdminNotes(command.adminNotes)
    }

    // Set timestamp based on status
    const now = new Date()
    switch (command.status) {
      case 'CONFIRMED':
        order.setConfirmedAt(now)
        break
      case 'SHIPPED':
        order.setShippedAt(now)
        break
      case 'DELIVERED':
        order.setDeliveredAt(now)
        break
      case 'CANCELLED':
        order.setCancelledAt(now)
        break
    }

    await this.orderRepository.save(order)
  }
}
