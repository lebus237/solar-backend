import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { ListCustomersQuery } from '../query/list_customers_query'
import { Customer } from '#kernel/customer/domain/entity/customer'
import type { CustomerRepository } from '#kernel/customer/domain/repository/customer_repository'

export interface CustomerDTO {
  id: string | null
  firstName: string
  lastName: string
  phone: string
  email?: string
  createdAt: Date | undefined
  updatedAt: Date | undefined
}

export class ListCustomersHandler implements QueryHandler<ListCustomersQuery, CustomerDTO[]> {
  constructor(private customerRepository: CustomerRepository) {}

  async handle(_query: ListCustomersQuery): Promise<CustomerDTO[]> {
    const customers = await this.customerRepository.findAll()

    return customers.map((customer: Customer) => ({
      id: customer.getId(),
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
      phone: customer.getPhone(),
      email: customer.getEmail(),
      createdAt: customer.getCreatedAt(),
      updatedAt: customer.getUpdatedAt(),
    }))
  }
}
