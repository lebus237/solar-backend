import { default as ActiveRecord } from '#database/active-records/product_category'
import { ProductCategoryRepository } from '#kernel/product/domain/repository/product_category_repository'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'

export class ProductCategoryARRepository implements ProductCategoryRepository {
  async find(id: any): Promise<ProductCategory> {
    const category = await ActiveRecord.find(id)

    if (category) {
      return new ProductCategory(
        category.id,
        category.designation,
        category.type,
        category.parentId,
        category.slug,
        category.createdAt as any,
        category.updatedAt as any
      )
    }
    return Promise.reject(category)
  }

  async save(entity: ProductCategory): Promise<void> {
    const object = {
      id: entity.getId(),
      designation: entity.getDesignation(),
      type: entity.getType(),
      parentId: entity.getParentId(),
      slug: entity.getSlug() as any,
    }

    if (entity.getId()) await ActiveRecord.updateOrCreate({ id: entity.getId() }, object)
    else await ActiveRecord.create(object)
  }
}
