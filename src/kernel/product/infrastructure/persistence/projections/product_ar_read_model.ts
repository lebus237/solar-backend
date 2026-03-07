import Product from '#database/active-records/product'
import { ProductDetailsDto } from '#kernel/product/application/dto/product_read_dto'
import { ProductReadModel } from '#kernel/product/application/read-model/product_read_model'
import { MediaManagerInterface } from '#shared/application/services/upload/media_manager_interface'

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

export class ProductARReadModel implements ProductReadModel {
  constructor(private readonly mediaManager: MediaManagerInterface) {}

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

    return this.mapToDto(product)
  }

  async getBySlug(slug: string): Promise<ProductDetailsDto | null> {
    const product = (await Product.query()
      .where('slug', slug)
      .preload('category')
      .preload('mainImage')
      .preload('images')
      .first()) as ProductActiveRecordWithRelations | null

    if (!product) {
      return null
    }

    return this.mapToDto(product)
  }

  private async mapToDto(product: ProductActiveRecordWithRelations): Promise<ProductDetailsDto> {
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

  private async getSignedUrl(relativeKey?: string | null): Promise<string | null> {
    if (!relativeKey) {
      return null
    }

    return this.mediaManager.getSignedUrl(relativeKey)
  }
}
