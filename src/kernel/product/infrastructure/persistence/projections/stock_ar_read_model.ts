import Product from '#database/active-records/product'

import { ProductStockDto } from '#kernel/product/application/dto/stock_read_dto'
import { StockReadModel } from '#kernel/product/application/read-model/stock_read_model'

export class StockARReadModel implements StockReadModel {
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
}
