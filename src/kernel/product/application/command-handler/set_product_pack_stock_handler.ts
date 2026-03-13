import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { SetProductPackStockCommand } from '#kernel/product/application/command/set_product_pack_stock_command'
import { ProductPackRepository } from '#kernel/product/domain/repository/product_pack_repository'
import { AppId } from '#shared/domain/app_id'

export class SetProductPackStockHandler implements CommandHandler<SetProductPackStockCommand> {
  constructor(private repository: ProductPackRepository) {}

  async handle(command: SetProductPackStockCommand): Promise<void> {
    const pack = await this.repository.find(AppId.fromString(command.packId))
    pack.setStockQuantity(command.quantity)
    await this.repository.save(pack)
  }
}
