import type { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { StoreImageCommand } from '#kernel/medias/application/command/store_image_command'
import { AppFile } from '#shared/domain/app_file'
import { mediaSchema } from '#validators/media_schema'

export default class ImageMediasController extends AppAbstractController {
  constructor() {
    super()
  }
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  /**
   * Display form to create a new record
   */

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const file = request.file('image', {})
    const payload = await request.validateUsing(mediaSchema)

    if (!file) {
      return response.badRequest({ errors: { image: 'Image is required' } })
    }

    await this.handleCommand(new StoreImageCommand(new AppFile(file), payload.title, payload.alt))

    return response.created()
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
