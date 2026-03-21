import { Command } from '#shared/application/use-cases/command'
import { AppId } from '#shared/domain/app_id'

export class DeleteMarketServiceCommand implements Command {
  readonly timestamp: Date
  constructor(public serviceId: AppId) {
    this.timestamp = new Date()
  }
}
