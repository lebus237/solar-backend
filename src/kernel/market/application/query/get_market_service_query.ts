import { Query } from '#shared/application/use-cases/query'

export class GetMarketServiceQuery implements Query {
  readonly timestamp: Date

  constructor(public readonly marketServiceId: string) {
    this.timestamp = new Date()
  }
}
