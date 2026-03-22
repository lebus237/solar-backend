import { Query } from '#shared/application/use-cases/query'

export class GetStoreQuery implements Query {
  readonly timestamp: Date

  constructor(public readonly storeId: string) {
    this.timestamp = new Date()
  }
}
