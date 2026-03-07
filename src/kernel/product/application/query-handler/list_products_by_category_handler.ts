import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { CategoryProductListItemDto } from '../dto/product_category_read_dto'
import { ProductCategoryCollection } from '../collection/product_category_collection'
import { ListProductsByCategoryQuery } from '../query/list_products_by_category_query'

export class ListProductsByCategoryHandler
  implements QueryHandler<ListProductsByCategoryQuery, PaginatedResultDto<CategoryProductListItemDto>>
{
  constructor(private readonly repository: ProductCategoryCollection) {}

  async handle(
    query: ListProductsByCategoryQuery
  ): Promise<PaginatedResultDto<CategoryProductListItemDto>> {
    return this.repository.listProducts(query)
  }
}
