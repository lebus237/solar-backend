import { MarketServiceFeature } from '#kernel/market/core/type/market_service_feature_type'
import { Command } from '#shared/application/use-cases/command'

export class CreateMarketServiceCommand implements Command {
  readonly timestamp: Date

  constructor(
    public designation: string,
    public thumbnail: string,
    public shortDescription?: string,
    public features?: Array<MarketServiceFeature>
  ) {
    this.timestamp = new Date()
  }
}
