import { default as ActiveRecord } from '#database/active-records/product_category'
import { ProductCategoryRepository } from '#kernel/product/core/repository/product_category_repository'
import { ProductCategory } from '#kernel/product/core/entity/product_category'

export class ProductCategoryARRepository implements ProductCategoryRepository {
  async findById(id: any): Promise<ProductCategory> {
    return (await ActiveRecord.findOrFail({ id: id })) as any
  }

  async save(entity: ProductCategory): Promise<void> {
    if (entity.getId()) await ActiveRecord.updateOrCreate({ id: entity.getId() }, entity)
    else await ActiveRecord.create(entity)
  }
}
