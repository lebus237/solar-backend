import { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import {
  createProductCategorySchema,
  updateProductCategorySchema,
} from '#validators/product_validator'
import { CreateProductCategoryCommand } from '#kernel/product/application/command/create_product_category_command'
import { UpdateProductCategoryCommand } from '#kernel/product/application/command/update_product_category_command'
import ActiveRecord from '#database/active-records/product_category'

export default class ProductCategoryController extends AppAbstractController {
  constructor() {
    super()
  }

  public async index({ response }: HttpContext) {
    const result = await ActiveRecord.all()

    return response.accepted({ data: result })
  }

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductCategorySchema)

    await this.handleCommand(
      new CreateProductCategoryCommand(payload.designation, payload.type, payload.parentId)
    )
    return response.created()
  }

  public async update({ request, response }: HttpContext) {
    const payload = await request.validateUsing(updateProductCategorySchema)
    const categoryId = await request.param('id')

    await this.handleCommand(
      new UpdateProductCategoryCommand(
        categoryId,
        payload.designation,
        payload.type,
        payload.parentId
      )
    )
    return response.noContent()
  }
}
