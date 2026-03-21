import { MarketServiceContentDescription } from '#kernel/market/domain/type/market_service_content_description.type'
import { Command } from '#shared/application/use-cases/command'
import { AppId } from '#shared/domain/app_id'

export class UpdateMarketServiceDescriptionCommand implements Command {
  readonly timestamp: Date

  constructor(
    public serviceId: AppId,
    public content: MarketServiceContentDescription
  ) {
    this.timestamp = new Date()
  }
}
