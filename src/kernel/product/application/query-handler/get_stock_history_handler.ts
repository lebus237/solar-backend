import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { StockMovementDto } from '../dto/stock_read_dto'
import { GetStockHistoryQuery } from '../query/get_stock_history_query'
import { StockCollection } from '#kernel/product/application/collection/stock_collection'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'

export class GetStockHistoryHandler implements QueryHandler<
  GetStockHistoryQuery,
  PaginatedResultDto<StockMovementDto>
> {
  constructor(private readonly repository: StockCollection) {}

  async handle(query: GetStockHistoryQuery): Promise<PaginatedResultDto<StockMovementDto>> {
    return this.repository.getStockHistory(query)
  }
}
