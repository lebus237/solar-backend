import { Query } from '#shared/application/use-cases/query'
import { Pagination } from '#shared/application/query-options/pagination'
import { QuerySearch } from '#shared/application/query-options/query_search'
import { Sort } from '#shared/application/query-options/sort'

export class ListProductsByCategoryQuery implements Query {
  readonly timestamp: Date

  constructor(
    public readonly categoryId: string,
    public readonly pagination: Pagination,
    public readonly query: QuerySearch,
    public readonly order: Sort
  ) {
    this.timestamp = new Date()
  }
}
