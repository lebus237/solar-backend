import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { Customer } from '#kernel/customer/domain/entity/customer'
import { CustomerId } from '#shared/domain/types/branded_types'

export interface CustomerRepository extends RepositoryInterface {
  save(entity: Customer): Promise<void>
  findById(id: CustomerId): Promise<Customer>
  findAll(): Promise<Customer[]>
  findByEmail(email: string): Promise<Customer | null>
  delete(id: CustomerId): Promise<void>
}
