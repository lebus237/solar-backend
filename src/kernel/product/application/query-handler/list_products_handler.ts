import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { ListProductsQuery } from '../queries/list_products_query'
import { PaginatedResultDto, ProductListItemDto } from '../dto/product_read_dto'
import { ProductCollection } from '../services/product_read_repository'

export class ListProductsHandler implements QueryHandler<
  ListProductsQuery,
  PaginatedResultDto<ProductListItemDto>
> {
  constructor(private readonly productReadRepository: ProductCollection) {}

  async handle(query: ListProductsQuery): Promise<PaginatedResultDto<ProductListItemDto>> {
    return this.productReadRepository.list({
      page: query.page,
      limit: query.limit,
      search: query.search,
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
    })
  }
}
