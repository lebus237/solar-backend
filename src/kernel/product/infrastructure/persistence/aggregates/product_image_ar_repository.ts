import { ProductImageRepository } from '#kernel/product/domain/repository/product_image_repository'
import { default as EntityActiveRecord } from '#database/active-records/product'
import ProductImage from '#database/active-records/product_image'

export class ProductImageARRepository implements ProductImageRepository {
  async addImage(productId: string, imageId: string, isMainImage: boolean): Promise<void> {
    if (isMainImage) {
      // Update the main image on the product
      await EntityActiveRecord.query().where('id', productId).update({ mainImageId: imageId })
    } else {
      // Get the max sort order for this product's images
      const maxSortResult = await ProductImage.query()
        .where('product_id', productId)
        .max('sort_order as maxSort')
        .first()
      const nextSortOrder = (maxSortResult?.$extras?.maxSort || 0) + 1

      await ProductImage.create({
        productId: productId as any,
        imageId: imageId as any,
        sortOrder: nextSortOrder,
      })
    }
  }

  async removeImage(productId: string, imageId: string): Promise<void> {
    // Check if it's the main image
    const product = await EntityActiveRecord.findOrFail(productId)
    if (product.mainImageId === imageId) {
      // Set mainImageId to null
      await EntityActiveRecord.query().where('id', productId).update({ mainImageId: null })
    } else {
      // Delete from product_images table
      await ProductImage.query().where('product_id', productId).where('image_id', imageId).delete()
    }
  }

  async countImages(productId: string): Promise<number> {
    const product = await EntityActiveRecord.findOrFail(productId)
    // Count main image (if exists) + additional images
    const additionalImagesCount = await ProductImage.query()
      .where('product_id', productId)
      .count('* as total')
      .first()

    const mainImageCount = product.mainImageId ? 1 : 0
    const additionalCount = Number(additionalImagesCount?.$extras?.total || 0)

    return mainImageCount + additionalCount
  }

  async hasMainImage(productId: string): Promise<boolean> {
    const product = await EntityActiveRecord.findOrFail(productId)
    return !!product.mainImageId
  }

  async isImageOwnedByProduct(productId: string, imageId: string): Promise<boolean> {
    const product = await EntityActiveRecord.findOrFail(productId)

    // Check if it's the main image
    if (product.mainImageId === imageId) {
      return true
    }

    // Check if it's in the additional images
    const image = await ProductImage.query()
      .where('product_id', productId)
      .where('image_id', imageId)
      .first()

    return !!image
  }
}
