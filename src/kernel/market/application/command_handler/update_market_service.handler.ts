import { MarketService } from '#kernel/market/core/entity/market_service'
import { MarketServiceRepository } from '#kernel/market/core/repository/market_service_repository'
import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { UpdateMarketServiceCommand } from '../command/update_market_service.command'

export class UpdateMarketServiceHandler implements CommandHandler<UpdateMarketServiceCommand> {
  constructor(public repository: MarketServiceRepository) {}

  async handle(command: UpdateMarketServiceCommand): Promise<void> {
    const marketService = await this.repository.getById(command.serviceId)

    this.repository.save(
      new MarketService(
        marketService.getId(),
        command.designation,
        command.thumbnail,
        marketService.getContent(),
        command.shortDescription,
        command.features,
        marketService.getImages(),
        marketService.getCreatedAt(),
        marketService.getUpdatedAt()
      )
    )
  }
}
