import { ProductPackRepository } from '#kernel/product/domain/repository/product_pack_repository'
import { default as EntityActiveRecord } from '#database/active-records/product_pack'
import ProductPackItemActiveRecord from '#database/active-records/product_pack_item'
import { ProductPack } from '#kernel/product/domain/entity/product_pack'
import { ProductPackItem } from '#kernel/product/domain/entity/product_pack_item'
import { ProductImage } from '#kernel/product/domain/entity/product_image'
import { ProductPackNotFoundError } from '#kernel/product/domain/errors/product_pack_not_found_error'
import { errors } from '@adonisjs/lucid'
import db from '@adonisjs/lucid/services/db'
import { AppId } from '#shared/domain/app_id'
import { DateTime } from 'luxon'

export class ProductPackARRepository implements ProductPackRepository {
  async find(id: AppId): Promise<ProductPack> {
    let pack: EntityActiveRecord

    try {
      pack = await EntityActiveRecord.query()
        .where('id', id.value)
        .where('is_deleted', false)
        .preload('packItems', (query) => query.orderBy('sort_order', 'asc'))
        .preload('mainImage')
        .firstOrFail()
    } catch (error) {
      if (error instanceof errors.E_ROW_NOT_FOUND) {
        throw new ProductPackNotFoundError(String(id), error)
      }
      throw error
    }

    const items = pack.packItems.map((item) => {
      return new ProductPackItem(
        AppId.fromString(item.id),
        AppId.fromString(item.productId),
        item.quantity,
        AppId.fromString(item.packId),
        item.sortOrder
      )
    })

    const mainImage = pack.mainImageId
      ? new ProductImage(AppId.fromString(pack.mainImageId), pack.mainImage?.url || null)
      : null

    return new ProductPack(
      AppId.fromString(pack.id),
      pack.designation,
      pack.description,
      pack.price,
      mainImage,
      items,
      pack.slug,
      pack.stockQuantity,
      pack.lowStockThreshold,
      pack.isAvailable,
      pack.isDeleted,
      this.toDate(pack.createdAt),
      this.toDate(pack.updatedAt)
    )
  }

  async save(entity: ProductPack): Promise<void> {
    const object = {
      id: entity.getId()?.value,
      designation: entity.getDesignation(),
      description: entity.getDescription(),
      price: entity.getPrice(),
      mainImageId: entity.getMainImage()?.id.value ?? null,
      slug: entity.getSlug(),
      stockQuantity: entity.getStockQuantity(),
      lowStockThreshold: entity.getLowStockThreshold(),
      isAvailable: entity.getIsAvailable(),
      isDeleted: entity.getIsDeleted(),
    }

    const trx = await db.transaction()

    try {
      let packRecord: EntityActiveRecord

      if (entity.getId()) {
        packRecord = await EntityActiveRecord.updateOrCreate(
          { id: entity.getId()?.value },
          object as any,
          { client: trx }
        )
      } else {
        packRecord = await EntityActiveRecord.create(object as any, { client: trx })
        entity.setId(AppId.fromString(packRecord.id))
      }

      // Handle pack items
      const items = entity.getItems()
      if (items.length > 0) {
        // Delete existing items
        await ProductPackItemActiveRecord.query({ client: trx })
          .where('pack_id', packRecord.id)
          .delete()

        // Insert new items
        for (const item of items) {
          await ProductPackItemActiveRecord.create(
            {
              packId: packRecord.id,
              productId: item.getProductId().value,
              quantity: item.getQuantity(),
              sortOrder: item.getSortOrder(),
            },
            { client: trx }
          )
        }
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async delete(id: AppId): Promise<void> {
    const pack = await EntityActiveRecord.findOrFail(id.value)
    pack.isDeleted = true
    await pack.save()
  }

  private toDate(dateTime: DateTime | null | undefined): Date | undefined {
    if (!dateTime) return undefined
    return dateTime.toJSDate()
  }
}
