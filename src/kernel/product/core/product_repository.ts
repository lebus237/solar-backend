import { Store } from '#kernel/store/core/store'
import { RepositoryInterface } from '#shared/domain/repository_interface'

export interface ProductRepository extends RepositoryInterface {
  save(entity: Store): Promise<void>
  findById(id: any): Promise<Store>
  delete(id: any): Promise<void>
}
