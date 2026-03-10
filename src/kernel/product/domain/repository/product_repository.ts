import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { Product } from '#kernel/product/domain/entity/product'
import { ProductId } from '#shared/domain/types/branded_types'

export interface ProductRepository extends RepositoryInterface {
  save(entity: Product): Promise<void>
  find(id: ProductId): Promise<Product>
  delete(id: ProductId): Promise<void>
}
