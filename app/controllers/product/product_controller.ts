import { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { CreateProductCommand } from '#kernel/product/application/command/create_product_command'
import { createProductSchema, updateProductSchema } from '#validators/product_validator'
import { UpdateProductCommand } from '#kernel/product/application/command/update_product_command'
import { ListProductsGroupedByCategoryQuery } from '#kernel/product/application/query/list_products_grouped_by_category_query'
import { GetProductQuery } from '#kernel/product/application/query/get_product_query'
import { ListProductsQuery } from '#kernel/product/application/query/list_products_query'

export default class ProductController extends AppAbstractController {
  constructor() {
    super()
  }

  public async index({ response, request }: HttpContext) {
    const query = request.qs()
    const result = await this.handleQuery(
      new ListProductsQuery(
        this.parseQueryPagination(query),
        this.parseQuerySearch(query),
        this.parseQuerySort(query)
      )
    )

    return response.ok(result)
  }

  public async show({ request, response }: HttpContext) {
    const productId = await request.param('id')
    const product = await this.handleQuery(new GetProductQuery(productId))

    return response.ok({ data: product })
  }

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductSchema)

    await this.handleCommand(
      new CreateProductCommand(
        payload.designation,
        payload.mainImageId,
        payload.categoryId,
        payload.description,
        payload.price,
        payload.brand,
        payload.imageIds || []
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
        payload.categoryId,
        payload.description,
        payload.price,
        payload.brand
      )
    )
    return response.noContent()
  }

  public async groupedByCategory({ response, request }: HttpContext) {
    const query = request.qs()
    const result = await this.handleQuery(
      new ListProductsGroupedByCategoryQuery(
        this.parseQueryPagination(query),
        this.parseQuerySearch(query)
      )
    )

    return response.ok(result)
  }
}
