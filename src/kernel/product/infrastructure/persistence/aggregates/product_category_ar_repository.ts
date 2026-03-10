import { default as ActiveRecord } from '#database/active-records/product_category'
import { ProductCategoryRepository } from '#kernel/product/domain/repository/product_category_repository'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'
import { ProductCategoryId, asProductCategoryId } from '#shared/domain/types/branded_types'
import { DateTime } from 'luxon'

export class ProductCategoryARRepository implements ProductCategoryRepository {
  async find(id: ProductCategoryId): Promise<ProductCategory> {
    const category = await ActiveRecord.find(id)

    if (category) {
      return new ProductCategory(
        asProductCategoryId(category.id),
        category.designation,
        category.type,
        category.parentId ? asProductCategoryId(category.parentId) : null,
        category.slug,
        this.toDate(category.createdAt),
        this.toDate(category.updatedAt)
      )
    }
    return Promise.reject(category)
  }

  async save(entity: ProductCategory): Promise<void> {
    const object = {
      id: entity.getId() as any,
      designation: entity.getDesignation(),
      type: entity.getType(),
      parentId: entity.getParentId() as any,
      slug: entity.getSlug(),
    }

    if (entity.getId())
      await ActiveRecord.updateOrCreate({ id: entity.getId() as any }, object as any)
    else await ActiveRecord.create(object as any)
  }

  private toDate(dateTime: DateTime | null | undefined): Date | undefined {
    if (!dateTime) return undefined
    return dateTime.toJSDate()
  }
}
