import { default as ActiveRecord } from '#database/active-records/product_category'
import { ProductCategoryRepository } from '#kernel/product/domain/repository/product_category_repository'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'
import { AppId } from '#shared/domain/app_id'
import { DateTime } from 'luxon'

export class ProductCategoryARRepository implements ProductCategoryRepository {
  async find(id: AppId): Promise<ProductCategory> {
    const category = await ActiveRecord.find(id.value)

    if (category) {
      return new ProductCategory(
        AppId.fromString(category.id),
        category.designation,
        category.type,
        category.parentId ? AppId.fromString(category.parentId) : null,
        category.slug,
        this.toDate(category.createdAt),
        this.toDate(category.updatedAt)
      )
    }
    return Promise.reject(category)
  }

  async save(entity: ProductCategory): Promise<void> {
    const object = {
      id: entity.getId()?.value as any,
      designation: entity.getDesignation(),
      type: entity.getType(),
      parentId: entity.getParentId()?.value as any,
      slug: entity.getSlug(),
    }

    if (entity.getId()) {
      await ActiveRecord.updateOrCreate({ id: entity.getId()!.value as any }, object as any)
    } else {
      const created = await ActiveRecord.create(object as any)
      entity.setId(AppId.fromString(created.id))
    }
  }

  private toDate(dateTime: DateTime | null | undefined): Date | undefined {
    if (!dateTime) return undefined
    return dateTime.toJSDate()
  }
}
