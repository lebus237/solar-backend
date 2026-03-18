import { Query } from '#shared/application/use-cases/query'
import { Pagination } from '#shared/application/query-options/pagination'
import { QuerySearch } from '#shared/application/query-options/query_search'
import { Sort } from '#shared/application/query-options/sort'

export class ListStaffMembersQuery implements Query {
  readonly timestamp: Date

  constructor(
    public readonly pagination: Pagination,
    public readonly searchQuery: QuerySearch,
    public readonly order: Sort
  ) {
    this.timestamp = new Date()
  }
}
