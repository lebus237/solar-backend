import { MarketServiceRepository } from '#kernel/market/domain/repository/market_service_repository'
import { ImageMediaRepository } from '#kernel/medias/domain/image_media_repository'
import { MediaManagerInterface } from '#shared/application/services/upload/media_manager_interface'
import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { ReplaceMarketServiceThumbnailCommand } from '#kernel/market/application/command/replace_market_service_thumbnail_command'
import { ImageNotFoundError } from '#kernel/medias/domain/errors/image_not_found_error'
import { MarketService } from '#kernel/market/domain/entity/market_service'

export class ReplaceMarketServiceThumbnailHandler implements CommandHandler<ReplaceMarketServiceThumbnailCommand> {
  constructor(
    private readonly repository: MarketServiceRepository,
    private readonly imageRepository: ImageMediaRepository,
    private readonly mediaManager: MediaManagerInterface
  ) {}

  async handle(command: ReplaceMarketServiceThumbnailCommand): Promise<void> {
    const marketService = await this.repository.getById(command.serviceId)
    const newThumbnail = await this.imageRepository.findById(command.newThumbnailId.value)

    if (!newThumbnail) {
      throw new ImageNotFoundError(command.newThumbnailId.value)
    }

    const oldThumbnail = marketService.getThumbnail()
    const oldThumbnailId = oldThumbnail?.getId()
    const oldKey = oldThumbnail?.getKey()

    // Update market service with new thumbnail
    await this.repository.save(
      new MarketService(
        marketService.getId(),
        marketService.getDesignation(),
        newThumbnail,
        marketService.getContent(),
        marketService.getShortDescription(),
        marketService.getFeatures(),
        marketService.getImages(),
        marketService.getCreatedAt(),
        marketService.getUpdatedAt()
      )
    )

    // Delete old thumbnail from storage and database after successful update
    if (oldThumbnail && oldThumbnailId) {
      if (oldKey && (await this.mediaManager.fileExists(oldKey))) {
        await this.mediaManager.deleteFile(oldKey)
      }
      await this.imageRepository.delete(oldThumbnailId)
    }
  }
}
