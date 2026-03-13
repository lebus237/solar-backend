import { ProductRepository } from '#kernel/product/domain/repository/product_repository'
import { default as EntityActiveRecord } from '#database/active-records/product'
import ProductImageAciveRecord from '#database/active-records/product_image'
import { Product } from '#kernel/product/domain/entity/product'
import { ProductImage } from '#kernel/product/domain/entity/product_image'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'
import crypto from 'node:crypto'
import { ProductNotFoundError } from '#kernel/product/application/errors/product_not_found_error'
import { errors } from '@adonisjs/lucid'
import { AppId } from '#shared/domain/app_id'
import { DateTime } from 'luxon'

const MAX_ADDITIONAL_IMAGES = 2

export class ProductARRepository implements ProductRepository {
  async find(id: AppId): Promise<Product> {
    let product: EntityActiveRecord

    try {
      product = await EntityActiveRecord.query()
        .where('id', id.value)
        .preload('images')
        .preload('category')
        .preload('mainImage')
        .preload('productImages')
        .firstOrFail()
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        throw new ProductNotFoundError(String(id), error)
      }

      throw error
    }

    // Map additional images to ProductImage type
    const images = (product.images || []).map((img) => new ProductImage(AppId.fromString(img.id)))

    return new Product(
      id,
      product.designation,
      new ProductCategory(
        product.category?.id ? AppId.fromString(product.category.id) : null,
        product.category?.designation || ''
      ),
      product.description,
      product.price,
      new ProductImage(AppId.fromString(product.mainImage?.id || '')),
      images,
      product.slug,
      product.brand,
      product.stockQuantity,
      product.lowStockThreshold,
      product.isAvailable,
      product.isDeleted,
      this.toDate(product.createdAt),
      this.toDate(product.updatedAt)
    )
  }

  async save(entity: Product): Promise<void> {
    const object = {
      id: entity.getId()?.value,
      designation: entity.getDesignation(),
      mainImageId: entity.getMainImage().id.value,
      categoryId: entity.getCategory().getId()?.value,
      description: entity.getDescription(),
      price: entity.getPrice(),
      brand: entity.getBrand(),
      slug: entity.getSlug(),
      isAvailable: entity.getIsAvailable(),
      isDeleted: entity.getIsDeleted(),
      stockQuantity: entity.getStockQuantity(),
      lowStockThreshold: entity.getLowStockThreshold(),
    }

    let productRecord: EntityActiveRecord

    if (entity.getId()) {
      productRecord = await EntityActiveRecord.updateOrCreate({ id: entity.getId()!.value }, object)
    } else {
      productRecord = await EntityActiveRecord.create(object)
      entity.setId(AppId.fromString(productRecord.id))
    }

    const imageIds = entity.getImages().map((item) => item.id.value)

    // Handle additional images (max 2)
    if (imageIds.length > 0) {
      // Delete existing product images
      await ProductImageAciveRecord.query().where('product_id', productRecord.id).delete()

      // Insert new product images (limit to MAX_ADDITIONAL_IMAGES)
      const limitedImageIds = imageIds.slice(0, MAX_ADDITIONAL_IMAGES)
      let sortOrder = 0
      for (const imageId of limitedImageIds) {
        await ProductImageAciveRecord.create({
          productId: productRecord.id,
          imageId: imageId as crypto.UUID,
          sortOrder: sortOrder++,
        })
      }
    }
  }

  async delete(id: AppId): Promise<void> {
    // Delete product images first (cascade should handle this, but being explicit)
    await ProductImageAciveRecord.query().where('product_id', id.value).delete()
    const product = await EntityActiveRecord.findOrFail(id.value)
    await product.delete()
  }

  private toDate(dateTime: DateTime | null | undefined): Date | undefined {
    if (!dateTime) return undefined
    return dateTime.toJSDate()
  }
}
