import { Command } from '#shared/application/use-cases/command'
import { AppId } from '#shared/domain/app_id'

export class ReplaceMarketServiceThumbnailCommand implements Command {
  readonly timestamp: Date

  constructor(
    public serviceId: AppId,
    public newThumbnailId: AppId
  ) {
    this.timestamp = new Date()
  }
}
