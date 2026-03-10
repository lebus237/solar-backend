import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { ListOrdersQuery } from '#kernel/order/application/query/list_orders_query'
import { OrderRepository } from '#kernel/order/domain/repository/order_repository'
import { Order } from '#kernel/order/domain/entity/order'

export class ListOrdersHandler implements QueryHandler<ListOrdersQuery, Order[]> {
  constructor(private orderRepository: OrderRepository) {}

  async handle(query: ListOrdersQuery): Promise<Order[]> {
    if (query.status) {
      const result = await this.orderRepository.findByStatus(query.status)
      return result.data
    }
    return this.orderRepository.findAll()
  }
}
