import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { GetOrderQuery } from '#kernel/order/application/query/get_order_query'
import { OrderRepository } from '#kernel/order/domain/repository/order_repository'
import { Order } from '#kernel/order/domain/entity/order'
import { AppId } from '#shared/domain/app_id'

export class GetOrderHandler implements QueryHandler<GetOrderQuery, Order> {
  constructor(private orderRepository: OrderRepository) {}

  async handle(query: GetOrderQuery): Promise<Order> {
    return this.orderRepository.findById(AppId.fromString(query.orderId))
  }
}
