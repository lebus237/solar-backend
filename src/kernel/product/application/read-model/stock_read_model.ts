import { ProductStockDto } from '#kernel/product/application/dto/stock_read_dto'

export interface StockReadModel {
  getProductStock(productId: string): Promise<ProductStockDto | null>
}
