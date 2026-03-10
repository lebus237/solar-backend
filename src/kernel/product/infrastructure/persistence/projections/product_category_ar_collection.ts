import ProductCategory from '#database/active-records/product_category'
import Product from '#database/active-records/product'

import {
  CategoryProductListItemDto,
  ProductCategoryListItemDto,
} from '#kernel/product/application/dto/product_category_read_dto'
import { MediaManagerInterface } from '#shared/application/services/upload/media_manager_interface'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ProductCategoryCollection } from '#kernel/product/application/collection/product_category_collection'
import { ListProductCategoriesQuery } from '#kernel/product/application/query/list_product_categories_query'
import { ListProductsByCategoryQuery } from '#kernel/product/application/query/list_products_by_category_query'
import { mapPaginatedResult } from '#shared/infrastructure/collection/paginated_result'
import { QuerySort } from '#shared/infrastructure/collection/query_sort'

type CategoryProductRecord = Product & {
  mainImage?: {
    relativeKey?: string
    relative_key?: string
  } | null
  category?: {
    id?: string
    designation?: string
  } | null
}

export class ProductCategoryARCollection implements ProductCategoryCollection {
  constructor(private readonly mediaManager: MediaManagerInterface) {}

  private static readonly sortableFields = ['created_at', 'designation', 'price'] as const

  async list({
    pagination,
    searchQuery,
  }: ListProductCategoriesQuery): Promise<PaginatedResultDto<ProductCategoryListItemDto>> {
    const result = await ProductCategory.query()
      .whereILike('designation', `%${searchQuery.search}%`)
      .orderBy('created_at', 'desc')
      .paginate(pagination.page, pagination.limit)

    return mapPaginatedResult<any, ProductCategoryListItemDto>(result as any, (category) => ({
      id: category.id,
      designation: category.designation,
      slug: category.slug ?? null,
      type: category.type,
      parentId: category.parentId ?? null,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }))
  }

  async listProducts({
    pagination,
    categoryId,
    query,
    order,
  }: ListProductsByCategoryQuery): Promise<PaginatedResultDto<CategoryProductListItemDto>> {
    // Extract first sort entry or use defaults
    const sortEntries = Object.entries(order.entries)
    const [requestedField = 'created_at', requestedDirection = 'desc'] = sortEntries[0] ?? []

    const sort = QuerySort.from({
      requestedField,
      requestedDirection,
      allowedFields: ProductCategoryARCollection.sortableFields,
      defaultField: 'created_at',
      defaultDirection: 'desc',
    })

    const result = await Product.query()
      .where('category_id', categoryId)
      .preload('category')
      .preload('mainImage')
      .whereILike('designation', `%${query.search}%`)
      .orderBy(sort.field, sort.direction)
      .paginate(pagination.page, pagination.limit)

    return mapPaginatedResult<CategoryProductRecord, CategoryProductListItemDto>(
      result as any,
      async (product) => ({
        id: product.id,
        slug: product.slug,
        designation: product.designation,
        price: product.price,
        categoryName: product.category?.designation ?? null,
        categoryId: product.category?.id ?? null,
        pictureUrl: await this.getSignedUrl(
          product.mainImage?.relativeKey || product.mainImage?.relative_key
        ),
        brand: product.brand ?? null,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })
    )
  }

  private async getSignedUrl(relativeKey?: string | null): Promise<string | null> {
    if (!relativeKey) {
      return null
    }

    return this.mediaManager.getSignedUrl(relativeKey)
  }
}
