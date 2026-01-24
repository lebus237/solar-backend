import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CreateProductCommand } from '#kernel/product/application/command/create_product_command'
import { ProductRepository } from '#kernel/product/core/product_repository'
import { Product } from '#kernel/product/core/product'

export class CreateProductHandler implements CommandHandler<CreateProductCommand> {
  constructor(private repository: ProductRepository) {}
  handle(command: CreateProductCommand): Promise<void> {
    const store = new Product(null, command.designation, command.domainUrl)
    return this.repository.save(store)
  }
}
