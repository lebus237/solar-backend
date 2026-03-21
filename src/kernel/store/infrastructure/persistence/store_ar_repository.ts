import { StoreRepository } from '#kernel/store/domain/store_repository'
import { Store } from '#kernel/store/domain/store'

export class StoreARRepository implements StoreRepository {
  findById(id: any): Promise<Store> {
    return Promise.reject(new Error('Not implemented'))
  }

  save(entity: Store): Promise<void> {
    return Promise.reject(new Error('Not implemented'))
  }
}
