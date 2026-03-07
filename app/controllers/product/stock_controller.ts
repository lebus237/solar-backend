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
import { GetProductStockQuery } from '#kernel/product/application/query/get_product_stock_query'
import { GetStockHistoryQuery } from '#kernel/product/application/query/get_stock_history_query'
import { ListLowStockProductsQuery } from '#kernel/product/application/query/list_low_stock_products_query'

export default class StockController extends AppAbstractController {
  constructor() {
    super()
  }

  public async show({ request, response }: HttpContext) {
    const productId = request.param('id')
    const product = await this.handleQuery(new GetProductStockQuery(productId))

    return response.ok({
      data: product,
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
    const result = (await this.handleQuery(
      new GetStockHistoryQuery(productId, this.parseQueryPagination(query))
    )) as any

    return response.ok({
      meta: result.meta,
      data: result.data,
    })
  }

  public async lowStock({ request, response }: HttpContext) {
    const query = request.qs()
    const result = (await this.handleQuery(
      new ListLowStockProductsQuery(this.parseQueryPagination(query))
    )) as any

    return response.ok({
      meta: result.meta,
      data: result.data,
    })
  }
}
