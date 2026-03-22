import { Pagination } from '#shared/application/query-options/pagination'
import { QuerySearch } from '#shared/application/query-options/query_search'
import { Query } from '#shared/application/use-cases/query'

export class GetStoreListQuery implements Query {
  readonly timestamp: Date

  constructor(
    public readonly pagination: Pagination,
    public readonly search: QuerySearch
  ) {
    this.timestamp = new Date()
  }
}
