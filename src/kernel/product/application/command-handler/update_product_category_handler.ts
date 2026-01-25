import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { ProductCategoryRepository } from '#kernel/product/core/repository/product_category_repository'
import { ProductCategory } from '#kernel/product/core/entity/product_category'
import { UpdateProductCategoryCommand } from '#kernel/product/application/command/update_product_category_command'

export class UpdateProductCategoryHandler implements CommandHandler<UpdateProductCategoryCommand> {
  constructor(private repository: ProductCategoryRepository) {}
  handle(command: UpdateProductCategoryCommand): Promise<void> {
    const category = new ProductCategory(
      command.categoryId,
      command.designation,
      command.type,
      command.parentId
    )
    return this.repository.save(category)
  }
}
