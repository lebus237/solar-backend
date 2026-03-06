import ProductCategory from '#database/active-records/product_category'
import Product from '#database/active-records/product'
import {
  ProductCategoryCollection,
  ProductCategoryProductsQueryOptions,
  ProductCategoryReadModel,
} from '#kernel/product/application/services/product_category_read_repository'
import { PaginatedResultDto } from '#kernel/product/application/dto/product_read_dto'
import {
  CategoryProductListItemDto,
  ProductCategoryDetailsDto,
  ProductCategoryListItemDto,
} from '#kernel/product/application/dto/product_category_read_dto'
import { MediaManagerInterface } from '#shared/application/services/upload/media_manager_interface'
import { QuerySort } from '#shared/infrastructure/query/query_sort'
import { mapPaginatedResult } from '#shared/infrastructure/query/paginated_result'

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

export class ProductCategoryReadARRepository
  implements ProductCategoryCollection, ProductCategoryReadModel
{
  constructor(private readonly mediaManager: MediaManagerInterface) {}

  private static readonly sortableFields = ['created_at', 'designation', 'price'] as const

  async list(params: {
    page: number
    limit: number
    search: string
  }): Promise<PaginatedResultDto<ProductCategoryListItemDto>> {
    const result = await ProductCategory.query()
      .whereILike('designation', `%${params.search}%`)
      .orderBy('created_at', 'desc')
      .paginate(params.page, params.limit)

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

  async getById(categoryId: string): Promise<ProductCategoryDetailsDto | null> {
    const category = await ProductCategory.find(categoryId)

    if (!category) {
      return null
    }

    return {
      id: category.id,
      designation: category.designation,
      slug: category.slug ?? null,
      type: category.type,
      parentId: category.parentId ?? null,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }
  }

  async listProducts(
    params: ProductCategoryProductsQueryOptions
  ): Promise<PaginatedResultDto<CategoryProductListItemDto>> {
    const sort = QuerySort.from({
      requestedField: params.sortBy,
      requestedDirection: params.sortDirection,
      allowedFields: ProductCategoryReadARRepository.sortableFields,
      defaultField: 'created_at',
      defaultDirection: 'desc',
    })

    const result = await Product.query()
      .where('category_id', params.categoryId)
      .preload('category')
      .preload('mainImage')
      .whereILike('designation', `%${params.search}%`)
      .orderBy(sort.field, sort.direction)
      .paginate(params.page, params.limit)

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
