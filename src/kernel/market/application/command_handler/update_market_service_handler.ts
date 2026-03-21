import { MarketService } from '#kernel/market/domain/entity/market_service'
import { MarketServiceRepository } from '#kernel/market/domain/repository/market_service_repository'
import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { UpdateMarketServiceCommand } from '#kernel/market/application/command/update_market_service_command'

export class UpdateMarketServiceHandler implements CommandHandler<UpdateMarketServiceCommand> {
  constructor(public repository: MarketServiceRepository) {}

  async handle(command: UpdateMarketServiceCommand): Promise<void> {
    const marketService = await this.repository.getById(command.serviceId)

    await this.repository.save(
      new MarketService(
        marketService.getId(),
        command.designation,
        marketService.getThumbnail(),
        command.contentDescription ?? marketService.getContent(),
        command.shortDescription,
        command.features,
        marketService.getImages(),
        marketService.getCreatedAt(),
        marketService.getUpdatedAt()
      )
    )
  }
}
