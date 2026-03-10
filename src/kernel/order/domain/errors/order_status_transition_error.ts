import { DomainError } from '#shared/domain/errors/domain_error'
import { OrderStatus } from '#kernel/order/domain/type/order_status'

export class OrderStatusTransitionError extends DomainError {
  constructor(currentStatus: OrderStatus, targetStatus: OrderStatus) {
    super(
      'ORDER_STATUS_TRANSITION_INVALID',
      `Cannot transition order from ${currentStatus} to ${targetStatus}`,
      { currentStatus, targetStatus }
    )
  }
}
