import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { GetProductPackStockQuery } from '#kernel/product/application/query/get_product_pack_stock_query'
import { ProductPackRepository } from '#kernel/product/domain/repository/product_pack_repository'
import { asProductPackId } from '#shared/domain/types/branded_types'

export interface ProductPackStockDto {
  packId: string | null
  stockQuantity: number | null
  lowStockThreshold: number
  hasOwnStock: boolean
  effectiveStock: number | null
  isLowStock: boolean
  isOutOfStock: boolean
}

export class GetProductPackStockHandler implements QueryHandler<
  GetProductPackStockQuery,
  ProductPackStockDto
> {
  constructor(private readonly repository: ProductPackRepository) {}

  async handle(query: GetProductPackStockQuery): Promise<ProductPackStockDto> {
    const pack = await this.repository.find(asProductPackId(query.packId))

    return {
      packId: pack.getId(),
      stockQuantity: pack.getStockQuantity(),
      lowStockThreshold: pack.getLowStockThreshold(),
      hasOwnStock: pack.hasOwnStock(),
      effectiveStock: pack.getEffectiveStock(),
      isLowStock: pack.isLowStock(),
      isOutOfStock: pack.isOutOfStock(),
    }
  }
}
