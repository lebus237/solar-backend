import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { Product } from '#kernel/product/domain/entity/product'
import { AppId } from '#shared/domain/app_id'

export interface ProductRepository extends RepositoryInterface {
  save(entity: Product): Promise<void>
  find(id: AppId): Promise<Product>
  delete(id: AppId): Promise<void>
}
