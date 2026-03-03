import { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { CreateProductCommand } from '#kernel/product/application/command/create_product_command'
import { createProductSchema, updateProductSchema } from '#validators/product_validator'
import { UpdateProductCommand } from '#kernel/product/application/command/update_product_command'
import ActiveRecord from '#database/active-records/product'
import app from '@adonisjs/core/services/app'
import { MediaManagerInterface } from '#shared/application/services/upload/media_manager_interface'

export default class ProductController extends AppAbstractController {
  constructor() {
    super()
  }

  public async index({ response, request }: HttpContext) {
    const query = request.qs()
    const result = await ActiveRecord.query()
      .whereILike('designation', `%${query.q || ''}%`)
      .paginate(query.page || 1, query.limit || 10)

    const mediaUploadService = (await app.container.make(
      'MediaUploadService'
    )) as MediaManagerInterface
    const paginatedResult = result.toJSON()

    paginatedResult.data = await Promise.all(
      paginatedResult.data.map(async (product: any) => {
        let signedUrl = null
        const relativeKey = product.picture?.relativeKey || product.picture?.relative_key
        if (relativeKey) {
          signedUrl = await mediaUploadService.getSignedUrl(relativeKey)
        }
        if (product.picture) {
          delete product.picture.url
        }

        return {
          id: product.id,
          slug: product.slug,
          designation: product.designation,
          price: product.price,
          categoryName: product.category?.designation,
          categoryId: product.category?.id,
          pictureUrl: signedUrl,
          brand: product.brand,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        }
      })
    )

    return response.ok(paginatedResult)
  }

  public async show({ request, response }: HttpContext) {
    const productId = await request.param('id')

    const product = await ActiveRecord.find(productId)
    const mediaUploadService = (await app.container.make(
      'MediaUploadService'
    )) as MediaManagerInterface

    let signedUrl = null
    const relativeKey = product?.picture?.relativeKey || (product?.picture as any)?.relative_key
    if (relativeKey) {
      signedUrl = await mediaUploadService.getSignedUrl(relativeKey)
    }

    const productJson = product?.toJSON()
    if (productJson?.picture) {
      delete productJson.picture.url
    }

    return response.ok({
      data: {
        product: productJson,
        signedUrl,
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
