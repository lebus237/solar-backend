import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { UpdateProductPackCommand } from '#kernel/product/application/command/update_product_pack_command'
import { ProductPackRepository } from '#kernel/product/domain/repository/product_pack_repository'
import { ProductPack } from '#kernel/product/domain/entity/product_pack'
import { ProductPackItem } from '#kernel/product/domain/entity/product_pack_item'
import { ProductImage } from '#kernel/product/domain/entity/product_image'
import crypto from 'node:crypto'
import { AppId } from '#shared/domain/app_id'

export class UpdateProductPackHandler implements CommandHandler<UpdateProductPackCommand> {
  constructor(private repository: ProductPackRepository) {}

  async handle(command: UpdateProductPackCommand): Promise<void> {
    const pack = await this.repository.find(AppId.fromString(command.packId))

    const items = command.items.map(
      (item, index) =>
        new ProductPackItem(
          AppId.fromString(crypto.randomUUID()),
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
