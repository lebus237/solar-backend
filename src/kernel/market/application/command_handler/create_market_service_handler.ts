import { MarketServiceRepository } from '#kernel/market/domain/repository/market_service_repository'
import { ImageMediaRepository } from '#kernel/medias/domain/image_media_repository'
import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CreateMarketServiceCommand } from '#kernel/market/application/command/create_market_service_command'
import { MarketService } from '#kernel/market/domain/entity/market_service'
import { ImageNotFoundError } from '#kernel/medias/domain/errors/image_not_found_error'

export class CreateMarketServiceHandler implements CommandHandler<CreateMarketServiceCommand> {
  constructor(
    public repository: MarketServiceRepository,
    public imageRepository: ImageMediaRepository
  ) {}

  async handle(command: CreateMarketServiceCommand): Promise<void> {
    const image = await this.imageRepository.findById(command.thumbnailId.value)

    if (!image) {
      throw new ImageNotFoundError(command.thumbnailId.value)
    }

    await this.repository.save(
      new MarketService(
        null,
        command.designation,
        image,
        command.contentDescription,
        command.shortDescription,
        command.features
      )
    )
  }
}
