import { HttpContext } from '@adonisjs/core/http'
import { CreateStoreCommand } from '#kernel/store/application/command/create_store_command'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { createStoreSchema, updateStoreSchema } from '#validators/store_validator'
import { Address } from '#shared/domain/value-objects/address'
import { PhoneNumber } from '#shared/domain/value-objects/phone_number'
import { BusinessHours } from '#shared/domain/value-objects/business_hours'
import { BusinessDay } from '#shared/domain/value-objects/business_day'
import { UpdateStoreCommand } from '#kernel/store/application/command/update_store_command'
import { AppId } from '#shared/domain/app_id'
import { ListStoreQuery } from '#kernel/store/application/query/list_stores_query'
import { GetStoreQuery } from '#kernel/store/application/query/get_store_query'

export default class StoreController extends AppAbstractController {
  constructor() {
    super()
  }

  public async index({ response, request }: HttpContext) {
    const query = request.qs()
    const results = await this.handleQuery(
      new ListStoreQuery(this.parseQueryPagination(query), this.parseQuerySearch(query))
    )

    response.status(200).json(results)
  }

  public async show({ request, response }: HttpContext) {
    const storeId = request.param('id')
    const result = await this.handleQuery(new GetStoreQuery(AppId.fromString(storeId)))

    response.status(200).json(result)
  }

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createStoreSchema)

    await this.handleCommand(
      new CreateStoreCommand(
        payload.designation,
        Address.of(payload.address),
        PhoneNumber.of(payload.phoneNumber1),
        payload.businessHours.map((value) =>
          BusinessHours.fromJson({
            day: BusinessDay.of(value.day).toName(),
            open: value.startTime,
            close: value.endTime,
          })
        ),
        payload.whatsappNumber ? PhoneNumber.of(payload.whatsappNumber) : null,
        payload.phoneNumber2 ? PhoneNumber.of(payload.phoneNumber2) : null
      )
    )
    return response.created()
  }

  public async update({ request, response }: HttpContext) {
    const payload = await request.validateUsing(updateStoreSchema)
    const storeId = request.param('id')

    await this.handleCommand(
      new UpdateStoreCommand(
        AppId.fromString(storeId),
        payload.designation,
        Address.of(payload.address),
        PhoneNumber.of(payload.phoneNumber1),
        payload.businessHours.map((value) =>
          BusinessHours.fromJson({
            day: BusinessDay.of(value.day).toName(),
            open: value.startTime,
            close: value.endTime,
          })
        ),
        payload.whatsappNumber ? PhoneNumber.of(payload.whatsappNumber) : null,
        payload.phoneNumber2 ? PhoneNumber.of(payload.phoneNumber2) : null
      )
    )

    return response.noContent()
  }
}
