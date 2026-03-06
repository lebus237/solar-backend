import { PaginatedResultDto } from '#kernel/product/application/dto/product_read_dto'
import {
  CategoryProductListItemDto,
  ProductCategoryDetailsDto,
  ProductCategoryListItemDto,
} from '#kernel/product/application/dto/product_category_read_dto'
import { PaginatedSearchQueryOptions } from '#shared/application/query-options/paginated_search_query_options'
import { PaginatedSearchSortQueryOptions } from '#shared/application/query-options/paginated_search_sort_query_options'

export type ProductCategoryListProductsSortField = 'created_at' | 'designation' | 'price'

export interface ProductCategoryProductsQueryOptions extends PaginatedSearchSortQueryOptions<ProductCategoryListProductsSortField> {
  categoryId: string
}

export interface ProductCategoryCollection {
  list(params: PaginatedSearchQueryOptions): Promise<PaginatedResultDto<ProductCategoryListItemDto>>
  listProducts(
    params: ProductCategoryProductsQueryOptions
  ): Promise<PaginatedResultDto<CategoryProductListItemDto>>
}

export interface ProductCategoryReadModel {
  getById(categoryId: string): Promise<ProductCategoryDetailsDto | null>
}
