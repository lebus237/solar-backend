import { Query } from '#shared/application/use-cases/query'
import { Pagination } from '#shared/application/query-options/pagination'

export class ListCustomerOrdersQuery implements Query {
  readonly timestamp: Date

  constructor(
    public readonly customerId: string,
    public readonly pagination?: Pagination
  ) {
    this.timestamp = new Date()
  }
}
