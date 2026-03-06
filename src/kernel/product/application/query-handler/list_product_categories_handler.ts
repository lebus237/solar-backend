import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { ListProductCategoriesQuery } from '../queries/list_product_categories_query'
import { PaginatedResultDto } from '../dto/product_read_dto'
import { ProductCategoryListItemDto } from '../dto/product_category_read_dto'
import { ProductCategoryCollection } from '../services/product_category_read_repository'

export class ListProductCategoriesHandler implements QueryHandler<
  ListProductCategoriesQuery,
  PaginatedResultDto<ProductCategoryListItemDto>
> {
  constructor(private readonly repository: ProductCategoryCollection) {}

  async handle(
    query: ListProductCategoriesQuery
  ): Promise<PaginatedResultDto<ProductCategoryListItemDto>> {
    return this.repository.list({
      page: query.page,
      limit: query.limit,
      search: query.search,
    })
  }
}
