import { Query } from '#shared/application/use-cases/query'

export class GetProductQuery implements Query {
  readonly timestamp: Date

  constructor(public readonly productId: string) {
    this.timestamp = new Date()
  }
}
