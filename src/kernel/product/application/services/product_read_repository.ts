import {
  GroupedProductsByCategoryDto,
  PaginatedResultDto,
  ProductDetailsDto,
  ProductListItemDto,
} from '#kernel/product/application/dto/product_read_dto'
import { PaginatedSearchQueryOptions } from '#shared/application/query-options/paginated_search_query_options'
import { PaginatedSearchSortQueryOptions } from '#shared/application/query-options/paginated_search_sort_query_options'

export type ProductListSortField = 'created_at'

export interface ProductCollection {
  list(
    params: PaginatedSearchSortQueryOptions<ProductListSortField>
  ): Promise<PaginatedResultDto<ProductListItemDto>>
  listGroupedByCategory(
    params: PaginatedSearchQueryOptions
  ): Promise<PaginatedResultDto<GroupedProductsByCategoryDto>>
}

export interface ProductReadModel {
  getById(productId: string): Promise<ProductDetailsDto | null>
}
