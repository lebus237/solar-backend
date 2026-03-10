import { Query } from '#shared/application/use-cases/query'
import { OrderStatus } from '#kernel/order/domain/type/order_status'

export class ListOrdersQuery implements Query {
  readonly timestamp: Date

  constructor(public readonly status?: OrderStatus) {
    this.timestamp = new Date()
  }
}
