import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { GroupedProductsByCategoryDto, PaginatedResultDto } from '../dto/product_read_dto'
import { ProductCollection } from '../services/product_read_repository'
import { ListProductsGroupedByCategoryQuery } from '../queries/list_products_grouped_by_category_query'

export class ListProductsGroupedByCategoryHandler implements QueryHandler<
  ListProductsGroupedByCategoryQuery,
  PaginatedResultDto<GroupedProductsByCategoryDto>
> {
  constructor(private readonly repository: ProductCollection) {}

  async handle(
    query: ListProductsGroupedByCategoryQuery
  ): Promise<PaginatedResultDto<GroupedProductsByCategoryDto>> {
    return this.repository.listGroupedByCategory({
      page: query.page,
      limit: query.limit,
      search: query.search,
    })
  }
}
