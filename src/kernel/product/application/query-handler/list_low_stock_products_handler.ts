import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { ListLowStockProductsQuery } from '../queries/list_low_stock_products_query'
import { PaginatedResultDto } from '../dto/product_read_dto'
import { LowStockProductDto } from '../dto/stock_read_dto'
import { StockCollection } from '../services/stock_read_repository'

export class ListLowStockProductsHandler implements QueryHandler<
  ListLowStockProductsQuery,
  PaginatedResultDto<LowStockProductDto>
> {
  constructor(private readonly repository: StockCollection) {}

  async handle(query: ListLowStockProductsQuery): Promise<PaginatedResultDto<LowStockProductDto>> {
    return this.repository.listLowStockProducts({
      page: query.page,
      limit: query.limit,
    })
  }
}
