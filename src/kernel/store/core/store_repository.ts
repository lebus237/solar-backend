import { Store } from '@/kernel/store/core/store'
import { RepositoryInterface } from '@/shared/domain/repository_interface'

export interface StoreRepository extends RepositoryInterface {
  save(entity: Store): Promise<void>
  findById(id: any): Promise<Store>
}
