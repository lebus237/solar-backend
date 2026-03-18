import { MarketServiceListItemDto } from '#kernel/market/application/dto/market_service_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ListMarketServicesQuery } from '#kernel/market/application/query/list_market_services_query'

export interface MarketServiceCollection {
  list(query: ListMarketServicesQuery): Promise<PaginatedResultDto<MarketServiceListItemDto>>
}
