import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CreateProductPackCommand } from '#kernel/product/application/command/create_product_pack_command'
import { ProductPackRepository } from '#kernel/product/domain/repository/product_pack_repository'
import { ProductPack } from '#kernel/product/domain/entity/product_pack'
import { ProductPackItem } from '#kernel/product/domain/entity/product_pack_item'
import { ProductImage } from '#kernel/product/domain/entity/product_image'
import crypto from 'node:crypto'
import { AppId } from '#shared/domain/app_id'

export class CreateProductPackHandler implements CommandHandler<CreateProductPackCommand> {
  constructor(private repository: ProductPackRepository) {}

  async handle(command: CreateProductPackCommand): Promise<void> {
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

    const pack = new ProductPack(
      null,
      command.designation,
      command.description ?? null,
      command.price,
      mainImage,
      items,
      undefined,
      command.stockQuantity ?? null,
      command.lowStockThreshold
    )

    await this.repository.save(pack)
  }
}
