import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { StockMovement } from '../entity/stock_movement'

export interface StockMovementRepository extends RepositoryInterface {
  save(entity: StockMovement): Promise<void>
  // find(id: string): Promise<StockMovement>
  findByProductId(
    productId: string,
    page?: number,
    limit?: number
  ): Promise<{
    data: StockMovement[]
    meta: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
    }
  }>
}
