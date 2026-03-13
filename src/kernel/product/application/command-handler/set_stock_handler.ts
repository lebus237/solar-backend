import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { SetStockCommand } from '#kernel/product/application/command/set_stock_command'
import { ProductRepository } from '#kernel/product/domain/repository/product_repository'
import { StockMovementRepository } from '#kernel/product/domain/repository/stock_movement_repository'
import { StockMovement } from '#kernel/product/domain/entity/stock_movement'
import { StockOperationType } from '#kernel/product/domain/type/stock_operation_type'
import { AppId } from '#shared/domain/app_id'

export class SetStockHandler implements CommandHandler<SetStockCommand> {
  constructor(
    private productRepository: ProductRepository,
    private stockMovementRepository: StockMovementRepository
  ) {}

  async handle(command: SetStockCommand): Promise<void> {
    const product = await this.productRepository.find(AppId.fromString(command.productId))
    const previousQuantity = product.getStockQuantity()
    const newQuantity = Math.max(0, command.quantity)

    product.setStockQuantity(newQuantity)
    await this.productRepository.save(product)

    const movement = new StockMovement(
      null,
      command.productId,
      StockOperationType.SET,
      newQuantity - previousQuantity,
      previousQuantity,
      newQuantity,
      command.reason
    )
    await this.stockMovementRepository.save(movement)
  }
}
