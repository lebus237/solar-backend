import {
  CategoryProductListItemDto,
  ProductCategoryListItemDto,
} from '#kernel/product/application/dto/product_category_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ListProductCategoriesQuery } from '#kernel/product/application/query/list_product_categories_query'
import { ListProductsByCategoryQuery } from '#kernel/product/application/query/list_products_by_category_query'

export interface ProductCategoryCollection {
  list(query: ListProductCategoriesQuery): Promise<PaginatedResultDto<ProductCategoryListItemDto>>
  listProducts(
    query: ListProductsByCategoryQuery
  ): Promise<PaginatedResultDto<CategoryProductListItemDto>>
}
