import { ProductRepository } from '#kernel/product/core/repository/product_repository'
import { default as ProductActiveRecord } from '#database/active-records/product'
import { Product } from '#kernel/product/core/entity/product'

export class ProductARRepository implements ProductRepository {
  async findById(id: any): Promise<Product> {
    return (await ProductActiveRecord.findOrFail({ id: id })) as any
  }

  async save(entity: Product): Promise<void> {
    if (entity.getId()) await ProductActiveRecord.updateOrCreate({ id: entity.getId() }, entity)
    else await ProductActiveRecord.create(entity)
  }

  async delete(id: any): Promise<void> {
    const product = await ProductActiveRecord.findOrFail(id)
    await product.delete()
  }
}
