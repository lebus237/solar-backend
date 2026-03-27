import { StoreReadModel } from '#kernel/store/application/read_model/store_read_model'
import { StoreDetailsDto } from '#kernel/store/application/dto/store_dto'
import { AppId } from '#shared/domain/app_id'
import { StoreRecord } from '#database/active-records/index'
import { ModelQueryBuilderHelper } from '#shared/infrastructure/persistence/model_query_builder'
import StoreBusinessHours from '#database/active-records/store_business_hours'
import { PhoneNumber } from '#shared/domain/value-objects/phone_number'
import { BusinessHours } from '#shared/domain/value-objects/business_hours'

export class StoreARReadModel extends ModelQueryBuilderHelper implements StoreReadModel {
  constructor() {
    super()
  }
  async storeById(storeId: AppId): Promise<StoreDetailsDto> {
    const storeRecord = StoreRecord.query()
    const store = await this.withRelation(['businessHours'], storeRecord)
      .where('id', storeId.value)
      .first()
    this.withRelation(['businessHours'], storeRecord)
    storeRecord.where('id', storeId.value)
    return this.mapToDto(store)
  }

  mapToDto(store: StoreRecord & { businessHours: StoreBusinessHours[] }): StoreDetailsDto {
    return {
      id: store.id,
      designation: store.designation,
      phoneNumber1: PhoneNumber.of(store.phoneContact1),
      phoneNumber2: store.phoneContact2 ? PhoneNumber.of(store.phoneContact2) : undefined,
      whatsappNumber: store.whatsAppContact ? PhoneNumber.of(store.whatsAppContact) : undefined,
      businessHours: store.businessHours.map((businessHour) =>
        BusinessHours.toJson(
          BusinessHours.from(businessHour.day, businessHour.open, businessHour.close)
        )
      ),
      address: store.address,
      createdAt: store.createdAt.toJSDate(),
      updatedAt: store.updatedAt.toJSDate(),
    }
  }
}
