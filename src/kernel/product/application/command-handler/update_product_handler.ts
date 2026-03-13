import { ProductRepository } from '#kernel/product/domain/repository/product_repository'
import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { UpdateProductCommand } from '#kernel/product/application/command/update_product_command'
import { Product } from '#kernel/product/domain/entity/product'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'
import { AppId } from '#shared/domain/app_id'

export class UpdateProductHandler implements CommandHandler<UpdateProductCommand> {
  constructor(private repository: ProductRepository) {}
  async handle(command: UpdateProductCommand): Promise<void> {
    const existingProduct = await this.repository.find(AppId.fromString(command.productId))

    const updatedProduct = new Product(
      existingProduct.getId(),
      command.designation,
      new ProductCategory(AppId.fromString(command.categoryId), ''),
      command.description,
      command.price,
      existingProduct.getMainImage(),
      existingProduct.getImages(),
      existingProduct.getSlug(),
      command.brand,
      existingProduct.getStockQuantity(),
      existingProduct.getLowStockThreshold(),
      existingProduct.getIsAvailable(),
      existingProduct.getIsDeleted()
    )

    // Save product
    await this.repository.save(updatedProduct)
  }
}
