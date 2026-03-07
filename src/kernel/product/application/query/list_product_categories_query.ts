import { Query } from '#shared/application/use-cases/query'
import { Pagination } from '#shared/application/query-options/pagination'
import { QuerySearch } from '#shared/application/query-options/query_search'

export class ListProductCategoriesQuery implements Query {
  readonly timestamp: Date

  constructor(
    public readonly pagination: Pagination,
    public readonly searchQuery: QuerySearch
  ) {
    this.timestamp = new Date()
  }
}
