import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { GetProductStockQuery } from '../queries/get_product_stock_query'
import { ProductStockDto } from '../dto/stock_read_dto'
import { StockReadModel } from '../services/stock_read_repository'
import { ProductNotFoundError } from '../errors/product_not_found_error'

export class GetProductStockHandler implements QueryHandler<GetProductStockQuery, ProductStockDto> {
  constructor(private readonly repository: StockReadModel) {}

  async handle(query: GetProductStockQuery): Promise<ProductStockDto> {
    const stock = await this.repository.getProductStock(query.productId)

    if (!stock) {
      throw new ProductNotFoundError(query.productId)
    }

    return stock
  }
}
