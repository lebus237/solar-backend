import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { GetOrderByNumberQuery } from '#kernel/order/application/query/get_order_by_number_query'
import { OrderRepository } from '#kernel/order/domain/repository/order_repository'
import { Order } from '#kernel/order/domain/entity/order'

export class GetOrderByNumberHandler implements QueryHandler<GetOrderByNumberQuery, Order | null> {
  constructor(private orderRepository: OrderRepository) {}

  async handle(query: GetOrderByNumberQuery): Promise<Order | null> {
    return this.orderRepository.findByOrderNumber(query.orderNumber)
  }
}
