import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { AddStockCommand } from '#kernel/product/application/command/add_stock_command'
import { ProductRepository } from '#kernel/product/domain/repository/product_repository'
import { StockMovementRepository } from '#kernel/product/domain/repository/stock_movement_repository'
import { StockMovement } from '#kernel/product/domain/entity/stock_movement'
import { StockOperationType } from '#kernel/product/domain/type/stock_operation_type'
import { asProductId } from '#shared/domain/types/branded_types'

export class AddStockHandler implements CommandHandler<AddStockCommand> {
  constructor(
    private productRepository: ProductRepository,
    private stockMovementRepository: StockMovementRepository
  ) {}

  async handle(command: AddStockCommand): Promise<void> {
    const product = await this.productRepository.find(asProductId(command.productId))
    const previousQuantity = product.getStockQuantity()
    const newQuantity = previousQuantity + command.quantity

    product.setStockQuantity(newQuantity)
    await this.productRepository.save(product)

    const movement = new StockMovement(
      null,
      command.productId,
      StockOperationType.ADD,
      command.quantity,
      previousQuantity,
      newQuantity,
      command.reason
    )
    await this.stockMovementRepository.save(movement)
  }
}
