import Product from '#database/active-records/product'
import StockMovement from '#database/active-records/stock_movement'
import {
  StockCollection,
  StockReadModel,
} from '#kernel/product/application/services/stock_read_repository'
import { PaginatedResultDto } from '#kernel/product/application/dto/product_read_dto'
import {
  LowStockProductDto,
  ProductStockDto,
  StockMovementDto,
} from '#kernel/product/application/dto/stock_read_dto'
import { mapPaginatedResult } from '#shared/infrastructure/query/paginated_result'

export class StockReadARRepository implements StockCollection, StockReadModel {
  async getProductStock(productId: string): Promise<ProductStockDto | null> {
    const product = await Product.find(productId)

    if (!product) {
      return null
    }

    return {
      productId: product.id,
      quantity: product.stockQuantity,
      lowStockThreshold: product.lowStockThreshold,
      isLowStock: product.stockQuantity > 0 && product.stockQuantity <= product.lowStockThreshold,
      isOutOfStock: product.stockQuantity <= 0,
    }
  }

  async getStockHistory(params: {
    productId: string
    page: number
    limit: number
  }): Promise<PaginatedResultDto<StockMovementDto>> {
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

  async listLowStockProducts(params: {
    page: number
    limit: number
  }): Promise<PaginatedResultDto<LowStockProductDto>> {
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
