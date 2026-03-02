import { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { CreateProductCommand } from '#kernel/product/application/command/create_product_command'
import { createProductSchema, updateProductSchema } from '#validators/product_validator'
import { UpdateProductCommand } from '#kernel/product/application/command/update_product_command'
import ActiveRecord from '#database/active-records/product'

export default class ProductController extends AppAbstractController {
  constructor() {
    super()
  }

  public async index({ response, request }: HttpContext) {
    const query = request.qs()
    const result = await ActiveRecord.query()
      .whereILike('designation', `%${query.q || ''}%`)
      .paginate(query.page || 1, query.limit || 10)

    return response.ok(result)
  }

  public async show({ request, response }: HttpContext) {
    const productId = await request.param('id')

    const product = await ActiveRecord.find(productId)

    return response.ok({
      data: {
        product,
        pictureUrl: product?.picture?.url,
        categoryName: product?.category?.designation,
      },
    })
  }

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductSchema)

    await this.handleCommand(
      new CreateProductCommand(
        payload.designation,
        payload.pictureId,
        payload.categoryId,
        payload.description,
        payload.price,
        payload.brand
      )
    )
    return response.created()
  }

  public async update({ request, response }: HttpContext) {
    const payload = await request.validateUsing(updateProductSchema)
    const productId = await request.param('id')

    await this.handleCommand(
      new UpdateProductCommand(
        productId,
        payload.designation,
        payload.pictureId,
        payload.categoryId,
        payload.description,
        payload.price,
        payload.brand
      )
    )
    return response.noContent()
  }
}
