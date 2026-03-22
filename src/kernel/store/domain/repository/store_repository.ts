import { Store } from '#kernel/store/domain/entity/store'
import { AppId } from '#shared/domain/app_id'
import { RepositoryInterface } from '#shared/infrastructure/repository_interface'

export interface StoreRepository extends RepositoryInterface {
  save(entity: Store): Promise<void>
  findById(id: AppId): Promise<Store | null>
}
