import { ProductRepository } from '#kernel/product/domain/repository/product_repository'
import { default as EntityActiveRecord } from '#database/active-records/product'
import ProductImage from '#database/active-records/product_image'
import { Product, ProductImage as ProductImageType } from '#kernel/product/domain/entity/product'

const MAX_ADDITIONAL_IMAGES = 2

export class ProductARRepository implements ProductRepository {
  async findById(id: any): Promise<Product> {
    const product = await EntityActiveRecord.findOrFail(id)

    // Map additional images to ProductImage type
    const images: ProductImageType[] = (product.images || []).map((img) => ({
      id: img.id,
      url: img.url || null,
      alt: img.altDescription || null,
      title: img.title || null,
    }))

    return new Product(
      product.id,
      product.designation,
      product.mainImageId,
      product.categoryId,
      product.description,
      product.price,
      product.brand,
      product.slug,
      product.isAvailable,
      product.isDeleted,
      product.createdAt as any,
      product.updatedAt as any,
      product.mainImage?.url || null,
      product.category?.designation || null,
      images,
      product.stockQuantity,
      product.lowStockThreshold
    )
  }

  async save(entity: Product, imageIds: string[] = []): Promise<void> {
    const object = {
      id: entity['id'],
      designation: entity['designation'],
      mainImageId: entity['mainImageId'],
      categoryId: entity['categoryId'],
      description: entity['description'],
      price: entity['price'],
      brand: entity['brand'],
      slug: entity['slug'] as any,
      isAvailable: entity['isAvailable'],
      isDeleted: entity['isDeleted'],
      stockQuantity: entity['stockQuantity'],
      lowStockThreshold: entity['lowStockThreshold'],
    }

    let productRecord: EntityActiveRecord

    if (entity.getId()) {
      productRecord = await EntityActiveRecord.updateOrCreate({ id: entity.getId() }, object)
    } else {
      productRecord = await EntityActiveRecord.create(object)
    }

    // Handle additional images (max 2)
    if (imageIds.length > 0) {
      // Delete existing product images
      await ProductImage.query().where('product_id', productRecord.id).delete()

      // Insert new product images (limit to MAX_ADDITIONAL_IMAGES)
      const limitedImageIds = imageIds.slice(0, MAX_ADDITIONAL_IMAGES)
      let sortOrder = 0
      for (const imageId of limitedImageIds) {
        await ProductImage.create({
          productId: productRecord.id,
          imageId: imageId as any,
          sortOrder: sortOrder++,
        })
      }
    }
  }

  async delete(id: any): Promise<void> {
    // Delete product images first (cascade should handle this, but being explicit)
    await ProductImage.query().where('product_id', id).delete()
    const product = await EntityActiveRecord.findOrFail(id)
    await product.delete()
  }
}
