import type { HttpContext } from '@adonisjs/core/http'
import { createMarketServiceSchema, updateMarketServiceSchema } from '#validators/market_validtor'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { CreateMarketServiceCommand } from '#kernel/market/application/command/create_market_service_command'
import { AppId } from '#shared/domain/app_id'
import { UpdateMarketServiceCommand } from '#kernel/market/application/command/update_market_service.command'
import { DeleteMarketServiceCommand } from '#kernel/market/application/command/delete_market_service.command'
import { ListMarketServicesQuery } from '#kernel/market/application/query/list_market_services_query'
import { GetMarketServiceQuery } from '#kernel/market/application/query/get_market_service_query'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import {
  MarketServiceListItemDto,
  MarketServiceDetailsDto,
} from '#kernel/market/application/dto/market_service_read_dto'

export default class MarketServicesController extends AppAbstractController {
  constructor() {
    super()
  }
  /**
   * Display a list of resource
   */
  async index({ request, response }: HttpContext) {
    const query = request.qs()
    const result = await this.handleQuery<PaginatedResultDto<MarketServiceListItemDto>>(
      new ListMarketServicesQuery(
        this.parseQueryPagination(query),
        this.parseQuerySearch(query),
        this.parseQuerySort(query)
      )
    )

    return response.ok(result)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const service = await request.validateUsing(createMarketServiceSchema)

    await this.handleCommand(
      new CreateMarketServiceCommand(
        service.designation,
        service.thumbnailUrl,
        AppId.fromString(service.thumbnailId),
        service.shortDescription,
        service.features
      )
    )

    return response.created()
  }

  /**
   * Show individual record
   */
  async show({ request, response }: HttpContext) {
    const marketServiceId = await request.param('id')
    const service = await this.handleQuery<MarketServiceDetailsDto | null>(
      new GetMarketServiceQuery(marketServiceId)
    )

    return response.ok({ data: service })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const service = await request.validateUsing(updateMarketServiceSchema)

    await this.handleCommand(
      new UpdateMarketServiceCommand(
        AppId.fromString(params.id),
        service.designation,
        service.thumbnailUrl,
        AppId.fromString(service.thumbnailId),
        service.shortDescription,
        service.features
      )
    )

    return response.noContent()
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    await this.handleCommand(new DeleteMarketServiceCommand(AppId.fromString(params.id)))

    return response.noContent()
  }
}
