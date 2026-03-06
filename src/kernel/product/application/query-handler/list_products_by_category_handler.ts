import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { ListProductsByCategoryQuery } from '../queries/list_products_by_category_query'
import { PaginatedResultDto } from '../dto/product_read_dto'
import { CategoryProductListItemDto } from '../dto/product_category_read_dto'
import { ProductCategoryCollection } from '../services/product_category_read_repository'

export class ListProductsByCategoryHandler implements QueryHandler<
  ListProductsByCategoryQuery,
  PaginatedResultDto<CategoryProductListItemDto>
> {
  constructor(private readonly repository: ProductCategoryCollection) {}

  async handle(
    query: ListProductsByCategoryQuery
  ): Promise<PaginatedResultDto<CategoryProductListItemDto>> {
    return this.repository.listProducts({
      categoryId: query.categoryId,
      page: query.page,
      limit: query.limit,
      search: query.search,
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
    })
  }
}
