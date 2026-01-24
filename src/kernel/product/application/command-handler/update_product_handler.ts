import { ProductRepository } from '#kernel/product/core/product_repository'
import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { UpdateProductCommand } from '../command/update_product_command'
import { Product } from '#kernel/product/core/product'

export class UpdateProductHandler implements CommandHandler<UpdateProductCommand> {
  constructor(private repository: ProductRepository) {}
  handle(command: UpdateProductCommand): Promise<void> {
    const store = new Product(command.storeId, command.designation, command.domainUrl)
    return this.repository.save(store)
  }
}
