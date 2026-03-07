import { ProductCategoryDetailsDto } from '#kernel/product/application/dto/product_category_read_dto'

export interface ProductCategoryReadModel {
  getById(categoryId: string): Promise<ProductCategoryDetailsDto | null>
}
