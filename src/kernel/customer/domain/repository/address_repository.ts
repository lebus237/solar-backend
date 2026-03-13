import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { Address } from '#kernel/customer/domain/entity/address'
import { AppId } from '#shared/domain/app_id'

export interface AddressRepository extends RepositoryInterface {
  save(entity: Address): Promise<void>
  findById(id: AppId): Promise<Address>
  findByCustomerId(customerId: AppId): Promise<Address[]>
  delete(id: AppId): Promise<void>
}
