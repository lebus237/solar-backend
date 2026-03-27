import { Query } from '#shared/application/use-cases/query'
import { AppId } from '#shared/domain/app_id'

export class GetStoreQuery implements Query {
  readonly timestamp: Date

  constructor(public readonly storeId: AppId) {
    this.timestamp = new Date()
  }
}
