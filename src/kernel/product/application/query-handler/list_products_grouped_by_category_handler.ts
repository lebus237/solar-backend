import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { GroupedProductsByCategoryDto } from '../dto/product_read_dto'
import { ProductCollection } from '../collection/product_collection'
import { ListProductsGroupedByCategoryQuery } from '../query/list_products_grouped_by_category_query'

export class ListProductsGroupedByCategoryHandler
  implements
    QueryHandler<
      ListProductsGroupedByCategoryQuery,
      PaginatedResultDto<GroupedProductsByCategoryDto>
    >
{
  constructor(private readonly repository: ProductCollection) {}

  async handle(
    query: ListProductsGroupedByCategoryQuery
  ): Promise<PaginatedResultDto<GroupedProductsByCategoryDto>> {
    return this.repository.listGroupedByCategory(query)
  }
}
