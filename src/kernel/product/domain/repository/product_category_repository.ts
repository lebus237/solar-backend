import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'
import { AppId } from '#shared/domain/app_id'

export interface ProductCategoryRepository extends RepositoryInterface {
  save(entity: ProductCategory): Promise<void>
  find(id: AppId): Promise<ProductCategory>
}
