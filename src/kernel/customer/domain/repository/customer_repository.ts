import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { Customer } from '#kernel/customer/domain/entity/customer'
import { AppId } from '#shared/domain/app_id'

export interface CustomerRepository extends RepositoryInterface {
  save(entity: Customer): Promise<void>
  findById(id: AppId): Promise<Customer>
  findAll(): Promise<Customer[]>
  findByEmail(email: string): Promise<Customer | null>
  delete(id: AppId): Promise<void>
}
