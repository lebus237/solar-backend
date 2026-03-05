import { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { AddStockCommand } from '#kernel/product/application/command/add_stock_command'
import { RemoveStockCommand } from '#kernel/product/application/command/remove_stock_command'
import { SetStockCommand } from '#kernel/product/application/command/set_stock_command'
import {
  addStockSchema,
  removeStockSchema,
  setStockSchema,
  stockHistorySchema,
} from '#validators/stock_validator'
import ProductActiveRecord from '#database/active-records/product'
import StockMovementActiveRecord from '#database/active-records/stock_movement'

export default class StockController extends AppAbstractController {
  constructor() {
    super()
  }

  public async show({ request, response }: HttpContext) {
    const productId = request.param('id')
    const product = await ProductActiveRecord.find(productId)

    if (!product) {
      return response.notFound({ message: 'Product not found' })
    }

    return response.ok({
      data: {
        productId: product.id,
        quantity: product.stockQuantity,
        lowStockThreshold: product.lowStockThreshold,
        isLowStock: product.stockQuantity > 0 && product.stockQuantity <= product.lowStockThreshold,
        isOutOfStock: product.stockQuantity <= 0,
      },
    })
  }

  public async add({ request, response }: HttpContext) {
    const productId = request.param('id')
    const payload = await request.validateUsing(addStockSchema)

    await this.handleCommand(new AddStockCommand(productId, payload.quantity, payload.reason))

    return response.noContent()
  }

  public async remove({ request, response }: HttpContext) {
    const productId = request.param('id')
    const payload = await request.validateUsing(removeStockSchema)

    await this.handleCommand(new RemoveStockCommand(productId, payload.quantity, payload.reason))

    return response.noContent()
  }

  public async set({ request, response }: HttpContext) {
    const productId = request.param('id')
    const payload = await request.validateUsing(setStockSchema)

    await this.handleCommand(new SetStockCommand(productId, payload.quantity, payload.reason))

    return response.noContent()
  }

  public async history({ request, response }: HttpContext) {
    const productId = request.param('id')
    const query = await request.validateUsing(stockHistorySchema)
    const page = query.page || 1
    const limit = query.limit || 20

    const result = await StockMovementActiveRecord.query()
      .where('product_id', productId)
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    const paginatedResult = result.toJSON()

    return response.ok({
      meta: paginatedResult.meta,
      data: paginatedResult.data.map((movement) => ({
        id: movement.id,
        operationType: movement.operationType,
        quantity: movement.quantity,
        previousQuantity: movement.previousQuantity,
        newQuantity: movement.newQuantity,
        reason: movement.reason,
        createdAt: movement.createdAt,
      })),
    })
  }

  public async lowStock({ request, response }: HttpContext) {
    const query = request.qs()
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10

    const result = await ProductActiveRecord.query()
      .where('stock_quantity', '>', 0)
      .whereRaw('stock_quantity <= low_stock_threshold')
      .orderBy('stock_quantity', 'asc')
      .paginate(page, limit)

    const paginatedResult = result.toJSON()

    return response.ok({
      meta: paginatedResult.meta,
      data: paginatedResult.data.map((product) => ({
        id: product.id,
        designation: product.designation,
        stockQuantity: product.stockQuantity,
        lowStockThreshold: product.lowStockThreshold,
        slug: product.slug,
      })),
    })
  }
}
