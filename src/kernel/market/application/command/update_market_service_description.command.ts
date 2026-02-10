import { MarketServiceContentDescription } from '#kernel/market/core/type/market_service_content_description.type'
import { Command } from '#shared/application/use-cases/command'
import { IdentifierInterface } from '#shared/domain/identifier'

export class UpdateMarketServiceDescriptionCommand implements Command {
  readonly timestamp: Date

  constructor(
    public serviceId: IdentifierInterface,
    public content: MarketServiceContentDescription
  ) {
    this.timestamp = new Date()
  }
}
