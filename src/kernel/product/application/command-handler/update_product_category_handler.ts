import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { ProductCategoryRepository } from '#kernel/product/domain/repository/product_category_repository'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'
import { UpdateProductCategoryCommand } from '#kernel/product/application/command/update_product_category_command'
import { AppId } from '#shared/domain/app_id'

export class UpdateProductCategoryHandler implements CommandHandler<UpdateProductCategoryCommand> {
  constructor(private repository: ProductCategoryRepository) {}
  async handle(command: UpdateProductCategoryCommand): Promise<void> {
    const category: ProductCategory = await this.repository.find(
      AppId.fromString(command.categoryId)
    )

    return this.repository.save(
      new ProductCategory(
        category.getId(),
        command.designation,
        command.type,
        command.parentId ? AppId.fromString(command.parentId) : null,
        category.getSlug(),
        category.getCreatedAt()
      )
    )
  }
}
