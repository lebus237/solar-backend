import Product from '#database/active-records/product'
import { ProductCollection } from '#kernel/product/application/collection/product_collection'
import {
  GroupedProductsByCategoryDto,
  ProductListItemDto,
} from '#kernel/product/application/dto/product_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { MediaManagerInterface } from '#shared/application/services/upload/media_manager_interface'
import { mapPaginatedResult } from '#shared/infrastructure/query/paginated_result'
import { ListProductsQuery } from '#kernel/product/application/query/list_products_query'
import { ListProductsGroupedByCategoryQuery } from '#kernel/product/application/query/list_products_grouped_by_category_query'

type ProductActiveRecordWithRelations = Product & {
  mainImage?: {
    id?: string
    relativeKey?: string
    relative_key?: string
    altDescription?: string
    title?: string
  } | null
  images?: Array<{
    id: string
    relativeKey?: string
    relative_key?: string
    altDescription?: string
    title?: string
  }>
  category?: {
    id?: string
    designation?: string
  } | null
}

export class ProductARCollection implements ProductCollection {
  constructor(private readonly mediaManager: MediaManagerInterface) {}

  async list(query: ListProductsQuery): Promise<PaginatedResultDto<ProductListItemDto>> {
    const result = await Product.query()
      .preload('category')
      .preload('mainImage')
      .whereILike('designation', `%${query.searchQuery.search}%`)
      .orderBy(query.order.field, query.order.direction)
      .paginate(query.pagination.page, query.pagination.limit)

    return mapPaginatedResult<ProductActiveRecordWithRelations, ProductListItemDto>(
      result as any,
      async (product) => {
        const mainImageUrl = await this.getSignedUrl(
          product.mainImage?.relativeKey || product.mainImage?.relative_key
        )

        return {
          id: product.id,
          slug: product.slug,
          designation: product.designation,
          price: product.price,
          category: {
            designation: product.category?.designation ?? null,
            id: product.category?.id ?? null,
          },
          mainImage: {
            url: mainImageUrl,
            alt: product.mainImage?.altDescription ?? null,
            title: product.mainImage?.title ?? null,
          },
          stockQuantity: product.stockQuantity,
          brand: product.brand ?? null,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        }
      }
    )
  }

  async listGroupedByCategory(
    params: ListProductsGroupedByCategoryQuery
  ): Promise<PaginatedResultDto<GroupedProductsByCategoryDto>> {
    const paginatedCategories = await Product.query()
      .whereILike('designation', `%${params.searchQuery.search}%`)
      .whereNotNull('category_id')
      .groupBy('category_id')
      .orderBy('category_id', 'asc')
      .paginate(params.pagination.page, params.pagination.limit)

    const categoryPage = paginatedCategories.toJSON()
    const categoryIds = categoryPage.data
      .map((item: any) => item.categoryId || item.category_id)
      .filter((categoryId): categoryId is string => Boolean(categoryId))

    const products = (await Product.query()
      .whereIn('category_id', categoryIds)
      .preload('category')
      .preload('mainImage')
      .orderBy('category_id', 'asc')
      .orderBy('designation', 'asc')) as ProductActiveRecordWithRelations[]

    const mappedProducts = await Promise.all(
      products.map(async (product) => ({
        id: product.id,
        slug: product.slug,
        designation: product.designation,
        price: product.price,
        categoryName: product.category?.designation ?? null,
        categoryId: product.category?.id ?? null,
        mainImageUrl: await this.getSignedUrl(
          product.mainImage?.relativeKey || product.mainImage?.relative_key
        ),
        brand: product.brand ?? null,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }))
    )

    const grouped = mappedProducts.reduce(
      (acc, product) => {
        const categoryId = product.categoryId || 'uncategorized'
        const categoryName = product.categoryName || 'Uncategorized'

        if (!acc[categoryId]) {
          acc[categoryId] = {
            categoryId,
            categoryName,
            products: [],
          }
        }

        acc[categoryId].products.push(product)
        return acc
      },
      {} as Record<string, GroupedProductsByCategoryDto>
    )

    return {
      meta: categoryPage.meta,
      data: Object.values(grouped),
    }
  }

  private async getSignedUrl(relativeKey?: string | null): Promise<string | null> {
    if (!relativeKey) {
      return null
    }

    return this.mediaManager.getSignedUrl(relativeKey)
  }
}
