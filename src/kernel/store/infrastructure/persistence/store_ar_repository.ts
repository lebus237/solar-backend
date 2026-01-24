import { StoreRepository } from '#kernel/store/core/store_repository'
import { Store } from '#kernel/store/core/store'

export class StoreARRepository implements StoreRepository {
  findById(id: any): Promise<Store> {
    console.log(id)
    return Promise.reject(new Error('Not implemented'))
  }

  save(entity: Store): Promise<void> {
    console.log(entity)
    return Promise.reject(new Error('Not implemented'))
  }
}
