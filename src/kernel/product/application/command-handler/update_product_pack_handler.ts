import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { UpdateProductPackCommand } from '#kernel/product/application/command/update_product_pack_command'
import { ProductPackRepository } from '#kernel/product/domain/repository/product_pack_repository'
import { ProductPack } from '#kernel/product/domain/entity/product_pack'
import { ProductPackItem } from '#kernel/product/domain/entity/product_pack_item'
import { ProductImage } from '#kernel/product/domain/entity/product_image'
import { AppId } from '#shared/domain/app_id'
import _ from 'lodash'
import { NotFoundApplicationError } from '#shared/application/errors/not_found_application_error'

export class UpdateProductPackHandler implements CommandHandler<UpdateProductPackCommand> {
  constructor(private repository: ProductPackRepository) {}

  async handle(command: UpdateProductPackCommand): Promise<void> {
    const pack = await this.repository.find(command.packId)

    if (!pack) {
      throw new NotFoundApplicationError(`Product pack with id ${command.packId} not found`)
    }

    const items = _.uniqBy(command.items, 'productId')
      .filter((item) => item.quantity > 0)
      .map(
        (item, index) =>
          new ProductPackItem(
            null,
            AppId.fromString(item.productId),
            item.quantity,
            undefined,
            index
          )
      )

    const mainImage = command.mainImageId
      ? new ProductImage(AppId.fromString(command.mainImageId))
      : null

    const updatedPack = new ProductPack(
      pack.getId(),
      command.designation,
      command.description ?? null,
      command.price,
      mainImage,
      items,
      pack.getSlug(),
      pack.getStockQuantity(),
      command.lowStockThreshold ?? pack.getLowStockThreshold(),
      pack.getIsAvailable(),
      pack.getIsDeleted(),
      pack.getCreatedAt(),
      new Date()
    )

    await this.repository.save(updatedPack)
  }
}
