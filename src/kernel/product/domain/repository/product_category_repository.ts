import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'
import { ProductCategoryId } from '#shared/domain/types/branded_types'

export interface ProductCategoryRepository extends RepositoryInterface {
  save(entity: ProductCategory): Promise<void>
  find(id: ProductCategoryId): Promise<ProductCategory>
}
