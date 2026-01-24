import { RepositoryInterface } from '#shared/domain/repository_interface'
import { Product } from './product'

export interface ProductRepository extends RepositoryInterface {
  save(entity: Product): Promise<void>
  findById(id: any): Promise<Product>
  delete(id: any): Promise<void>
}
