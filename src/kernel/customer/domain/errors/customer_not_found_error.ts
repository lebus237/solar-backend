import { DomainError } from '#shared/domain/errors/domain_error'

export class CustomerNotFoundError extends DomainError {
  constructor(customerId: string) {
    super('CUSTOMER_NOT_FOUND', `Customer with id "${customerId}" not found`, { customerId })
  }
}
