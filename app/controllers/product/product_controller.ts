import { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { CreateProductCommand } from '#kernel/product/application/command/create_product_command'

export default class ProductController extends AppAbstractController {
  constructor() {
    super()
  }

  public async store({ request, response }: HttpContext) {
    const payload = request.body()

    await this.handleCommand(
      new CreateProductCommand(
        payload.designation,
        payload.categoryId,
        payload.description,
        payload.pictureUrl,
        payload.price,
        payload.brand
      )
    )
    return response.created('created')
  }
}
