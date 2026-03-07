import { HttpContext } from '@adonisjs/core/http'
import { CreateStoreCommand } from '#kernel/store/application/command/create_store_command'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'

export default class StoreController extends AppAbstractController {
  constructor() {
    super()
  }

  public async store({ request, response }: HttpContext) {
    const payload = request.body()

    await this.handleCommand(
      new CreateStoreCommand(payload.designation, payload.domainUrl, payload.description)
    )
    return response.created()
  }
}
