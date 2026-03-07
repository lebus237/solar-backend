import { Query } from '#shared/application/use-cases/query'

export class GetProductCategoryQuery implements Query {
  readonly timestamp: Date

  constructor(public readonly categoryId: string) {
    this.timestamp = new Date()
  }
}
