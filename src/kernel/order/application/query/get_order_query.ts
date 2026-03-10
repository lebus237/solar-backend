import { Query } from '#shared/application/use-cases/query'

export class GetOrderQuery implements Query {
  readonly timestamp: Date

  constructor(public readonly orderId: string) {
    this.timestamp = new Date()
  }
}
