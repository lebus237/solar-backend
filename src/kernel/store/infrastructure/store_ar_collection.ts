import { StoreCollection } from '#kernel/store/application/collection/store_collection'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { StoreListItemDto } from '#kernel/store/application/dto/store_dto'
import { StoreRecord } from '#database/active-records/index'
import { ModelQueryBuilderHelper } from '#shared/infrastructure/persistence/model_query_builder'
import { ListStoreQuery } from '#kernel/store/application/query/list_stores_query'
import { mapPaginatedResult } from '#shared/infrastructure/collection/paginated_result'
import StoreBusinessHours from '#database/active-records/store_business_hours'
import { PhoneNumber } from '#shared/domain/value-objects/phone_number'

export class StoreARCollection extends ModelQueryBuilderHelper implements StoreCollection {
  constructor() {
    super()
  }
  async collection(query: ListStoreQuery): Promise<PaginatedResultDto<StoreListItemDto>> {
    const storeBuilder = StoreRecord.query()

    storeBuilder.whereILike('designation', `%${query.search.search}%`)
    const result = await this.applyPaginate(query.pagination, storeBuilder)

    return mapPaginatedResult<
      StoreRecord & { businessHours: StoreBusinessHours[] },
      StoreListItemDto
    >(result as any, async (item) => ({
      id: item.id,
      designation: item.designation,
      phoneNumber1: PhoneNumber.of(item.phoneContact1).toE164(),
      address: item.address,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }))
  }
}
