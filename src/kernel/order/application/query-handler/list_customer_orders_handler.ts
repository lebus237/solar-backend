import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { ListCustomerOrdersQuery } from '#kernel/order/application/query/list_customer_orders_query'
import { OrderRepository } from '#kernel/order/domain/repository/order_repository'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { Order } from '#kernel/order/domain/entity/order'
import { AppId } from '#shared/domain/app_id'

export class ListCustomerOrdersHandler implements QueryHandler<
  ListCustomerOrdersQuery,
  PaginatedResultDto<Order>
> {
  constructor(private orderRepository: OrderRepository) {}

  async handle(query: ListCustomerOrdersQuery): Promise<PaginatedResultDto<Order>> {
    return this.orderRepository.findByCustomerId(AppId.fromString(query.customerId))
  }
}
