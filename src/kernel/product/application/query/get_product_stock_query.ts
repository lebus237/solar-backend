import { Query } from '#shared/application/use-cases/query'

export class GetProductStockQuery implements Query {
  readonly timestamp: Date

  constructor(public readonly productId: string) {
    this.timestamp = new Date()
  }
}
