import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { GetCustomerQuery } from '#kernel/customer/application/query/get_customer_query'
import { Customer } from '#kernel/customer/domain/entity/customer'
import type { CustomerRepository } from '#kernel/customer/domain/repository/customer_repository'
import { CustomerDTO } from '#kernel/customer/application/query-handler/list_customers_handler'
import { AppId } from '#shared/domain/app_id'

export class GetCustomerHandler implements QueryHandler<GetCustomerQuery, CustomerDTO> {
  constructor(private customerRepository: CustomerRepository) {}

  async handle(query: GetCustomerQuery): Promise<CustomerDTO> {
    const customer: Customer = await this.customerRepository.findById(
      AppId.fromString(query.customerId)
    )

    return {
      id: customer.getId()?.value ?? null,
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
      phone: customer.getPhone(),
      email: customer.getEmail(),
      createdAt: customer.getCreatedAt(),
      updatedAt: customer.getUpdatedAt(),
    }
  }
}
