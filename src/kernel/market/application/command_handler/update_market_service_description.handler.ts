import { MarketService } from '#kernel/market/core/entity/market_service'
import { MarketServiceRepository } from '#kernel/market/core/repository/market_service_repository'
import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { UpdateMarketServiceDescriptionCommand } from '../command/update_market_service_description.command'

export class UpdateMarketServiceDescriptionHandler implements CommandHandler<UpdateMarketServiceDescriptionCommand> {
  constructor(public repository: MarketServiceRepository) {}

  async handle(command: UpdateMarketServiceDescriptionCommand): Promise<void> {
    const marketService = await this.repository.getById(command.serviceId)

    this.repository.save(
      new MarketService(
        marketService.getId(),
        marketService.getDesignation(),
        marketService.getThumbnail(),
        command.content,
        marketService.getShortDescription(),
        marketService.getFeatures(),
        marketService.getImages(),
        marketService.getCreatedAt(),
        marketService.getUpdatedAt()
      )
    )
  }
}
