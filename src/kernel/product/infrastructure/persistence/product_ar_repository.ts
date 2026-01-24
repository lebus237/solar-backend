import { Store } from '#kernel/store/core/store'
import { ProductRepository } from '#kernel/product/core/product_repository'

export class ProductARRepository implements ProductRepository {
  findById(id: any): Promise<Store> {
    console.log(id)
    return Promise.reject(new Error('Not implemented'))
  }

  save(entity: Store): Promise<void> {
    console.log(entity)
    return Promise.reject(new Error('Not implemented'))
  }

  delete(id: any): Promise<void> {
    console.log(id)
    return Promise.reject(new Error('Not implemented'))
  }
}
