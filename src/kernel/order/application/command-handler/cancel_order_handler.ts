import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CancelOrderCommand } from '#kernel/order/application/command/cancel_order_command'
import { OrderRepository } from '#kernel/order/domain/repository/order_repository'
import { canTransitionTo, OrderStatus } from '#kernel/order/domain/type/order_status'
import { AppId } from '#shared/domain/app_id'
import { OrderStatusTransitionError } from '#kernel/order/domain/errors/order_status_transition_error'

export class CancelOrderHandler implements CommandHandler<CancelOrderCommand> {
  constructor(private orderRepository: OrderRepository) {}

  async handle(command: CancelOrderCommand): Promise<void> {
    const orderId = AppId.fromString(command.orderId)
    const order = await this.orderRepository.findById(orderId)

    // Validate status transition
    if (!canTransitionTo(order.getStatus(), OrderStatus.CANCELLED)) {
      throw new OrderStatusTransitionError(order.getStatus(), OrderStatus.CANCELLED)
    }

    // Update status to cancelled
    order.setStatus(OrderStatus.CANCELLED)
    order.setCancelledAt(new Date())

    // Add cancellation reason to admin notes
    if (command.reason) {
      const existingNotes = order.getAdminNotes() || ''
      const cancellationNote = `Cancellation reason: ${command.reason}`
      order.setAdminNotes(
        existingNotes ? `${existingNotes}\n${cancellationNote}` : cancellationNote
      )
    }

    await this.orderRepository.save(order)
  }
}
