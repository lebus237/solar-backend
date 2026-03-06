import Product from '#database/active-records/product'
import {
  ProductCollection,
  ProductReadModel,
} from '#kernel/product/application/services/product_read_repository'
import {
  GroupedProductsByCategoryDto,
  PaginatedResultDto,
  ProductDetailsDto,
  ProductListItemDto,
} from '#kernel/product/application/dto/product_read_dto'
import { MediaManagerInterface } from '#shared/application/services/upload/media_manager_interface'
import { mapPaginatedResult } from '#shared/infrastructure/query/paginated_result'

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

export class ProductReadARRepository implements ProductCollection, ProductReadModel {
  constructor(private readonly mediaManager: MediaManagerInterface) {}

  async list(params: {
    page: number
    limit: number
    search: string
    sortBy: 'created_at'
    sortDirection: 'asc' | 'desc'
  }): Promise<PaginatedResultDto<ProductListItemDto>> {
    const result = await Product.query()
      .preload('product_categories')
      .preload('mainImage')
      .whereILike('designation', `%${params.search}%`)
      .orderBy(params.sortBy, params.sortDirection)
      .paginate(params.page, params.limit)

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

  async getById(productId: string): Promise<ProductDetailsDto | null> {
    const product = (await Product.query()
      .where('id', productId)
      .preload('category')
      .preload('mainImage')
      .preload('images')
      .first()) as ProductActiveRecordWithRelations | null

    if (!product) {
      return null
    }

    const mainImageUrl = await this.getSignedUrl(product.mainImage?.relativeKey)

    const images = await Promise.all(
      (product.images || []).map(async (image) => ({
        id: image.id,
        url: await this.getSignedUrl(image.relativeKey),
        alt: image.altDescription ?? null,
        title: image.title ?? null,
      }))
    )

    return {
      id: product.id,
      slug: product.slug,
      categoryId: product.categoryId ?? null,
      designation: product.designation,
      description: product.description,
      price: product.price,
      brand: product.brand ?? null,
      isAvailable: product.isAvailable,
      isDeleted: product.isDeleted,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: {
        id: product.category?.id ?? null,
        designation: product.category?.designation ?? null,
      },
      mainImage: {
        id: product.mainImage?.id ?? null,
        url: mainImageUrl,
        alt: product.mainImage?.altDescription ?? null,
        title: product.mainImage?.title ?? null,
      },
      images,
    }
  }

  async listGroupedByCategory(params: {
    page: number
    limit: number
    search: string
  }): Promise<PaginatedResultDto<GroupedProductsByCategoryDto>> {
    const paginatedCategories = await Product.query()
      .whereILike('designation', `%${params.search}%`)
      .whereNotNull('category_id')
      .groupBy('category_id')
      .orderBy('category_id', 'asc')
      .paginate(params.page, params.limit)

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
