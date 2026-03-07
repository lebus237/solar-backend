import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { Product } from '../entity/product'

export interface ProductRepository extends RepositoryInterface {
  save(entity: Product): Promise<void>
  find(id: any): Promise<Product>
  delete(id: any): Promise<void>
}
