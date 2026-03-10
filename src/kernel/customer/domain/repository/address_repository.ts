import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { Address } from '#kernel/customer/domain/entity/address'
import { AddressId, CustomerId } from '#shared/domain/types/branded_types'

export interface AddressRepository extends RepositoryInterface {
  save(entity: Address): Promise<void>
  findById(id: AddressId): Promise<Address>
  findByCustomerId(customerId: CustomerId): Promise<Address[]>
  delete(id: AddressId): Promise<void>
}
