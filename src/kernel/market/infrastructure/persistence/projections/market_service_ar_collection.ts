import EntityManager from '#database/active-records/market_service'
import { MarketServiceCollection } from '#kernel/market/application/collection/market_service_collection'
import { MarketServiceListItemDto } from '#kernel/market/application/dto/market_service_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ListMarketServicesQuery } from '#kernel/market/application/query/list_market_services_query'
import { ModelQueryBuilderHelper } from '#shared/infrastructure/persistence/model_query_builder'
import { mapPaginatedResult } from '#shared/infrastructure/collection/paginated_result'

export class MarketServiceARCollection
  extends ModelQueryBuilderHelper
  implements MarketServiceCollection
{
  async list(
    query: ListMarketServicesQuery
  ): Promise<PaginatedResultDto<MarketServiceListItemDto>> {
    let queryBuilder = EntityManager.query()

    queryBuilder.whereILike('designation', `%${query.searchQuery.search}%`)
    this.applySort(query.order, ['created_at'], queryBuilder)

    const result = await this.applyPaginate(query.pagination, queryBuilder)

    return mapPaginatedResult<any, MarketServiceListItemDto>(result as any, (ms) => ({
      id: ms.id,
      slug: ms.slug,
      designation: ms.designation,
      thumbnailUrl: ms.thumbnailUrl,
      shortDescription: ms.shortDescription ?? null,
      createdAt: ms.createdAt,
      updatedAt: ms.updatedAt,
    }))
  }
}
