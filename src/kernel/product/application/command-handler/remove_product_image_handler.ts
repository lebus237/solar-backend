import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { RemoveProductImageCommand } from '#kernel/product/application/command/remove_product_image_command'
import { ProductImageRepository } from '#kernel/product/domain/repository/product_image_repository'
import { ProductImageNotOwnedError } from '#kernel/product/domain/errors/product_image_not_owned_error'

export class RemoveProductImageHandler implements CommandHandler<RemoveProductImageCommand> {
  constructor(private productImageRepository: ProductImageRepository) {}

  async handle(command: RemoveProductImageCommand): Promise<void> {
    const isOwner = await this.productImageRepository.isImageOwnedByProduct(
      command.productId,
      command.imageId
    )

    if (!isOwner) {
      throw new ProductImageNotOwnedError(command.productId, command.imageId)
    }

    await this.productImageRepository.removeImage(command.productId, command.imageId)
  }
}
