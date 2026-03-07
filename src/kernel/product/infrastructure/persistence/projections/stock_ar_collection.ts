import Product from '#database/active-records/product'
import StockMovement from '#database/active-records/stock_movement'

import {
  LowStockProductDto,
  StockMovementDto,
} from '#kernel/product/application/dto/stock_read_dto'
import { mapPaginatedResult } from '#shared/infrastructure/query/paginated_result'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { StockCollection } from '#kernel/product/application/collection/stock_collection'

export class StockARCollection implements StockCollection {
  async getStockHistory(params: any): Promise<PaginatedResultDto<StockMovementDto>> {
    const result = await StockMovement.query()
      .where('product_id', params.productId)
      .orderBy('created_at', 'desc')
      .paginate(params.page, params.limit)

    return mapPaginatedResult<any, StockMovementDto>(result as any, (movement) => ({
      id: movement.id,
      operationType: movement.operationType,
      quantity: movement.quantity,
      previousQuantity: movement.previousQuantity,
      newQuantity: movement.newQuantity,
      reason: movement.reason,
      createdAt: movement.createdAt,
    }))
  }

  async listLowStockProducts(params: any): Promise<PaginatedResultDto<LowStockProductDto>> {
    const result = await Product.query()
      .where('stock_quantity', '>', 0)
      .whereRaw('stock_quantity <= low_stock_threshold')
      .orderBy('stock_quantity', 'asc')
      .paginate(params.page, params.limit)

    return mapPaginatedResult<any, LowStockProductDto>(result as any, (product) => ({
      id: product.id,
      designation: product.designation,
      stockQuantity: product.stockQuantity,
      lowStockThreshold: product.lowStockThreshold,
      slug: product.slug,
    }))
  }
}
