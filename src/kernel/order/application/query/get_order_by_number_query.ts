import { Query } from '#shared/application/use-cases/query'

export class GetOrderByNumberQuery implements Query {
  readonly timestamp: Date

  constructor(public readonly orderNumber: string) {
    this.timestamp = new Date()
  }
}
