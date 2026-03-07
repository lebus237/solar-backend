import ProductCategory from '#database/active-records/product_category'

import { ProductCategoryDetailsDto } from '#kernel/product/application/dto/product_category_read_dto'
import { ProductCategoryReadModel } from '#kernel/product/application/read-model/product_category_read_model'

export class ProductCategoryARReadModel implements ProductCategoryReadModel {
  constructor() {}

  async getById(categoryId: string): Promise<ProductCategoryDetailsDto | null> {
    const category = await ProductCategory.find(categoryId)

    if (!category) {
      return null
    }

    return {
      id: category.id,
      designation: category.designation,
      slug: category.slug ?? null,
      type: category.type,
      parentId: category.parentId ?? null,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }
  }
}
