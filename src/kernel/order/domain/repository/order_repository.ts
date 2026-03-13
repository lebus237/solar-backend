import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { Order } from '#kernel/order/domain/entity/order'
import { AppId } from '#shared/domain/app_id'
import { OrderStatus } from '#kernel/order/domain/type/order_status'

export interface OrderRepository extends RepositoryInterface {
  save(entity: Order): Promise<void>
  findById(id: AppId): Promise<Order>
  findAll(): Promise<Order[]>
  findByOrderNumber(orderNumber: string): Promise<Order | null>
  findByCustomerId(
    customerId: AppId,
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
  delete(id: AppId): Promise<void>
}
