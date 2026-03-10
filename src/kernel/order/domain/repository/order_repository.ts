import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { Order } from '#kernel/order/domain/entity/order'
import { OrderId, CustomerId } from '#shared/domain/types/branded_types'
import { OrderStatus } from '#kernel/order/domain/type/order_status'

export interface OrderRepository extends RepositoryInterface {
  save(entity: Order): Promise<void>
  findById(id: OrderId): Promise<Order>
  findAll(): Promise<Order[]>
  findByOrderNumber(orderNumber: string): Promise<Order | null>
  findByCustomerId(
    customerId: CustomerId,
    page?: number,
    limit?: number
  ): Promise<{
    data: Order[]
    meta: { total: number; perPage: number; currentPage: number; lastPage: number }
  }>
  findByStatus(
    status: OrderStatus,
    page?: number,
    limit?: number
  ): Promise<{
    data: Order[]
    meta: { total: number; perPage: number; currentPage: number; lastPage: number }
  }>
  delete(id: OrderId): Promise<void>
}
