import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { MarketServiceListItemDto } from '#kernel/market/application/dto/market_service_read_dto'
import { MarketServiceCollection } from '#kernel/market/application/collection/market_service_collection'
import { ListMarketServicesQuery } from '#kernel/market/application/query/list_market_services_query'

export class ListMarketServicesHandler implements QueryHandler<
  ListMarketServicesQuery,
  PaginatedResultDto<MarketServiceListItemDto>
> {
  constructor(private readonly collection: MarketServiceCollection) {}

  async handle(
    query: ListMarketServicesQuery
  ): Promise<PaginatedResultDto<MarketServiceListItemDto>> {
    return this.collection.list(query)
  }
}
