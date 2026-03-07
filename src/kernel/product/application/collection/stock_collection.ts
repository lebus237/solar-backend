import {
  LowStockProductDto,
  StockMovementDto,
} from '#kernel/product/application/dto/stock_read_dto'
import { ListLowStockProductsQuery } from '#kernel/product/application/query/list_low_stock_products_query'
import { GetStockHistoryQuery } from '#kernel/product/application/query/get_stock_history_query'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'

export interface StockCollection {
  getStockHistory(query: GetStockHistoryQuery): Promise<PaginatedResultDto<StockMovementDto>>
  listLowStockProducts(
    query: ListLowStockProductsQuery
  ): Promise<PaginatedResultDto<LowStockProductDto>>
}
