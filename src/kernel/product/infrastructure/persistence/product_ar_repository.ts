import { ProductRepository } from '#kernel/product/core/product_repository'
import { Product } from '#kernel/product/core/product'

export class ProductARRepository implements ProductRepository {
  findById(id: any): Promise<Product> {
    console.log(id)
    return Promise.reject(new Error('Not implemented'))
  }

  save(entity: Product): Promise<void> {
    console.log(entity)
    return Promise.reject(new Error('Not implemented'))
  }

  delete(id: any): Promise<void> {
    console.log(id)
    return Promise.reject(new Error('Not implemented'))
  }
}
