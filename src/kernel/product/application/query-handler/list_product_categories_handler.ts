import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ProductCategoryListItemDto } from '../dto/product_category_read_dto'
import { ProductCategoryCollection } from '../collection/product_category_collection'
import { ListProductCategoriesQuery } from '../query/list_product_categories_query'

export class ListProductCategoriesHandler
  implements
    QueryHandler<ListProductCategoriesQuery, PaginatedResultDto<ProductCategoryListItemDto>>
{
  constructor(private readonly repository: ProductCategoryCollection) {}

  async handle(
    query: ListProductCategoriesQuery
  ): Promise<PaginatedResultDto<ProductCategoryListItemDto>> {
    return this.repository.list(query)
  }
}
