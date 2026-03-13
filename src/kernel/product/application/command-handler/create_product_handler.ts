import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CreateProductCommand } from '#kernel/product/application/command/create_product_command'
import { ProductRepository } from '#kernel/product/domain/repository/product_repository'
import { Product } from '#kernel/product/domain/entity/product'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'
import { ProductImage } from '#kernel/product/domain/entity/product_image'
import { AppId } from '#shared/domain/app_id'

export class CreateProductHandler implements CommandHandler<CreateProductCommand> {
  constructor(private repository: ProductRepository) {}
  async handle(command: CreateProductCommand): Promise<void> {
    const product = new Product(
      null,
      command.designation,
      new ProductCategory(AppId.fromString(command.categoryId), ''),
      command.description,
      command.price,
      new ProductImage(AppId.fromString(command.mainImageId)),
      command.imageIds.map((id) => new ProductImage(AppId.fromString(id))),
      undefined,
      command.brand
    )

    // Save product and additional images
    await this.repository.save(product)
  }
}
