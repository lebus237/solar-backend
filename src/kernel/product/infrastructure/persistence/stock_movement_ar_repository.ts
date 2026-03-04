import { StockMovementRepository } from '#kernel/product/domain/repository/stock_movement_repository'
import { default as EntityActiveRecord } from '#database/active-records/stock_movement'
import { StockMovement } from '#kernel/product/domain/entity/stock_movement'

export class StockMovementARRepository implements StockMovementRepository {
  async save(entity: StockMovement): Promise<void> {
    const object = {
      productId: entity['productId'] as any,
      operationType: entity['operationType'],
      quantity: entity['quantity'],
      previousQuantity: entity['previousQuantity'],
      newQuantity: entity['newQuantity'],
      reason: entity['reason'] || null,
    }

    if (entity.getId()) {
      await EntityActiveRecord.updateOrCreate({ id: entity.getId() as any }, object)
    } else {
      await EntityActiveRecord.create(object)
    }
  }

  async findByProductId(
    productId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: StockMovement[]
    meta: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
    }
  }> {
    const result = await EntityActiveRecord.query()
      .where('product_id', productId)
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    const paginatedResult = result.toJSON()

    const stockMovements = paginatedResult.data.map((record) => {
      return new StockMovement(
        record.id,
        record.productId,
        record.operationType as any,
        record.quantity,
        record.previousQuantity,
        record.newQuantity,
        record.reason,
        record.createdAt as any
      )
    })

    return {
      data: stockMovements,
      meta: paginatedResult.meta,
    }
  }
}
