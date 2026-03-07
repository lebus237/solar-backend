import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { LowStockProductDto } from '../dto/stock_read_dto'
import { StockCollection } from '../collection/stock_collection'
import { ListLowStockProductsQuery } from '../query/list_low_stock_products_query'

export class ListLowStockProductsHandler
  implements QueryHandler<ListLowStockProductsQuery, PaginatedResultDto<LowStockProductDto>>
{
  constructor(private readonly repository: StockCollection) {}

  async handle(
    query: ListLowStockProductsQuery
  ): Promise<PaginatedResultDto<LowStockProductDto>> {
    return this.repository.listLowStockProducts(query)
  }
}
