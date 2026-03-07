import { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import {
  createProductCategorySchema,
  updateProductCategorySchema,
} from '#validators/product_validator'
import { CreateProductCategoryCommand } from '#kernel/product/application/command/create_product_category_command'
import { UpdateProductCategoryCommand } from '#kernel/product/application/command/update_product_category_command'
import { ListProductCategoriesQuery } from '#kernel/product/application/query/list_product_categories_query'
import { GetProductCategoryQuery } from '#kernel/product/application/query/get_product_category_query'
import { ListProductsByCategoryQuery } from '#kernel/product/application/query/list_products_by_category_query'

export default class ProductCategoryController extends AppAbstractController {
  constructor() {
    super()
  }

  public async index({ response, request }: HttpContext) {
    const query = request.qs()
    const result = await this.handleQuery(
      new ListProductCategoriesQuery(this.parseQueryPagination(query), this.parseQuerySearch(query))
    )

    return response.ok(result)
  }

  public async show({ response, request }: HttpContext) {
    const categoryId = await request.param('id')
    const result = await this.handleQuery(new GetProductCategoryQuery(categoryId))

    return response.accepted({ data: result })
  }

  public async products({ response, request }: HttpContext) {
    const categoryId = await request.param('id')
    const query = request.qs()

    const result = await this.handleQuery(
      new ListProductsByCategoryQuery(
        categoryId,
        this.parseQueryPagination(query),
        this.parseQuerySearch(query),
        this.parseQuerySort(query)
      )
    )

    return response.ok(result)
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
