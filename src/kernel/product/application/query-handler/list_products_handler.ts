import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ProductListItemDto } from '../dto/product_read_dto'
import { ProductCollection } from '../collection/product_collection'
import { ListProductsQuery } from '../query/list_products_query'

export class ListProductsHandler
  implements QueryHandler<ListProductsQuery, PaginatedResultDto<ProductListItemDto>>
{
  constructor(private readonly repository: ProductCollection) {}

  async handle(query: ListProductsQuery): Promise<PaginatedResultDto<ProductListItemDto>> {
    return this.repository.list(query)
  }
}
