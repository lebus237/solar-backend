import { MarketServiceFeature } from '#kernel/market/domain/type/market_service_feature_type'
import { MarketServiceContentDescription } from '#kernel/market/domain/type/market_service_content_description.type'
import { Command } from '#shared/application/use-cases/command'
import { AppId } from '#shared/domain/app_id'

export class UpdateMarketServiceCommand implements Command {
  readonly timestamp: Date

  constructor(
    public serviceId: AppId,
    public designation: string,
    public contentDescription?: MarketServiceContentDescription,
    public shortDescription?: string,
    public features?: Array<MarketServiceFeature>
  ) {
    this.timestamp = new Date()
  }
}
