import {
  GroupedProductsByCategoryDto,
  ProductListItemDto,
} from '#kernel/product/application/dto/product_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ListProductsQuery } from '#kernel/product/application/query/list_products_query'
import { ListProductsGroupedByCategoryQuery } from '#kernel/product/application/query/list_products_grouped_by_category_query'

export interface ProductCollection {
  list(query: ListProductsQuery): Promise<PaginatedResultDto<ProductListItemDto>>
  listGroupedByCategory(
    query: ListProductsGroupedByCategoryQuery
  ): Promise<PaginatedResultDto<GroupedProductsByCategoryDto>>
}
