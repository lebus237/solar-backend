import { ImageMediaRepository } from '#kernel/medias/domain/image_media_repository'
import { MediaUploader } from '#shared/application/services/upload/media_uploader'
import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { StoreImageCommand } from '#kernel/medias/application/command/store_image_command'
import { ImageMedia } from '#kernel/medias/domain/image_media'

export class StoreImageHandler implements CommandHandler<StoreImageCommand> {
  constructor(
    private repository: ImageMediaRepository,
    private uploadService: MediaUploader
  ) {}

  async handle(command: StoreImageCommand): Promise<void> {
    const upload = await this.uploadService.uploadImage(
      {
        buffer: await command.file.getBuffer(),
        originalName: command.file.originalName,
        mimeType: command.file.mimeType,
        size: command.file.size,
      },
      command.file.getFile()
    )

    if (!upload.success) {
      throw new Error(`${upload.error}`)
    }

    await this.repository.save(
      new ImageMedia(
        null,
        command.title,
        upload.url as string,
        command.altDescription,
        command.dimension
      )
    )
  }
}
