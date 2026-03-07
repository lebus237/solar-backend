import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { ProductCategory } from '../entity/product_category'

export interface ProductCategoryRepository extends RepositoryInterface {
  save(entity: ProductCategory): Promise<void>
  find(id: any): Promise<ProductCategory>
}
