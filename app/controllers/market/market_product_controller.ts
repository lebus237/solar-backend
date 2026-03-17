import { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { GetProductQuery } from '#kernel/product/application/query/get_product_query'
import { ListProductsQuery } from '#kernel/product/application/query/list_products_query'
import { ListProductCategoriesQuery } from '#kernel/product/application/query/list_product_categories_query'
import { ListProductsGroupedByCategoryQuery } from '#kernel/product/application/query/list_products_grouped_by_category_query'

export default class MarketProductController extends AppAbstractController {
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

  public async categories({ response, request }: HttpContext) {
    const query = request.qs()
    const result = await this.handleQuery(
      new ListProductCategoriesQuery(this.parseQueryPagination(query), this.parseQuerySearch(query))
    )

    return response.ok(result)
  }

  public async groupedByCategory({ response, request }: HttpContext) {
    const query = request.qs()
    const result = await this.handleQuery(
      new ListProductsGroupedByCategoryQuery(
        this.parseQueryPagination(query),
        this.parseQuerySearch(query),
        this.parseQuerySort(query)
      )
    )

    return response.ok(result)
  }
}
