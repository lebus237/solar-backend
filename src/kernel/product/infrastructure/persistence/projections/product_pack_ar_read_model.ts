import {
  ProductPackDetailsDto,
  ProductPackItemDto,
} from '#kernel/product/application/dto/product_pack_read_dto'
import { ProductPackReadModelContract } from '#kernel/product/application/query-handler/get_product_pack_handler'
import { default as ProductPackActiveRecord } from '#database/active-records/product_pack'

export class ProductPackARReadModel implements ProductPackReadModelContract {
  async getById(packId: string): Promise<ProductPackDetailsDto | null> {
    const pack = await ProductPackActiveRecord.query()
      .where('id', packId)
      .where('is_deleted', false)
      .preload('packItems', (query) => query.orderBy('sort_order', 'asc').preload('product'))
      .preload('mainImage')
      .first()

    if (!pack) {
      return null
    }

    const items: ProductPackItemDto[] = pack.packItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product?.designation || '',
      productSlug: item.product?.slug || '',
      productPrice: item.product?.price || 0,
      quantity: item.quantity,
      sortOrder: item.sortOrder,
      productMainImageUrl: item.product?.mainImage?.url || null,
    }))

    return {
      id: pack.id,
      designation: pack.designation,
      slug: pack.slug,
      description: pack.description,
      price: pack.price,
      mainImageUrl: pack.mainImage?.url || null,
      stockQuantity: pack.stockQuantity,
      // lowStockThreshold: pack.lowStockThreshold,
      isAvailable: pack.isAvailable,
      // isDeleted: pack.isDeleted,
      items,
      createdAt: pack.createdAt.toISO()!,
      updatedAt: pack.updatedAt.toISO()!,
    }
  }

  async getBySlug(slug: string): Promise<ProductPackDetailsDto | null> {
    const pack = await ProductPackActiveRecord.query()
      .where('slug', slug)
      .where('is_deleted', false)
      .preload('packItems', (query) => query.orderBy('sort_order', 'asc').preload('product'))
      .preload('mainImage')
      .first()

    if (!pack) {
      return null
    }

    const items: ProductPackItemDto[] = pack.packItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product?.designation || '',
      productSlug: item.product?.slug || '',
      productPrice: item.product?.price || 0,
      quantity: item.quantity,
      sortOrder: item.sortOrder,
      productMainImageUrl: item.product?.mainImage?.url || null,
    }))

    return {
      id: pack.id,
      designation: pack.designation,
      slug: pack.slug,
      description: pack.description,
      price: pack.price,
      mainImageUrl: pack.mainImage?.url || null,
      stockQuantity: pack.stockQuantity,
      // lowStockThreshold: pack.lowStockThreshold,
      isAvailable: pack.isAvailable,
      // isDeleted: pack.isDeleted,
      items,
      createdAt: pack.createdAt.toISO()!,
      updatedAt: pack.updatedAt.toISO()!,
    }
  }
}
