import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { DeleteProductPackCommand } from '#kernel/product/application/command/delete_product_pack_command'
import { ProductPackRepository } from '#kernel/product/domain/repository/product_pack_repository'
import { asProductPackId } from '#shared/domain/types/branded_types'

export class DeleteProductPackHandler implements CommandHandler<DeleteProductPackCommand> {
  constructor(private repository: ProductPackRepository) {}

  async handle(command: DeleteProductPackCommand): Promise<void> {
    await this.repository.delete(asProductPackId(command.packId))
  }
}
