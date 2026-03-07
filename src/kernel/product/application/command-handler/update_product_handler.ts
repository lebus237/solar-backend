import { ProductRepository } from '#kernel/product/domain/repository/product_repository'
import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { UpdateProductCommand } from '../command/update_product_command'
import { Product } from '#kernel/product/domain/entity/product'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'

export class UpdateProductHandler implements CommandHandler<UpdateProductCommand> {
  constructor(private repository: ProductRepository) {}
  async handle(command: UpdateProductCommand): Promise<void> {
    const existingProduct = await this.repository.find(command.productId)

    const updatedProduct = new Product(
      existingProduct.getId(),
      command.designation,
      new ProductCategory(command.categoryId, ''),
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
