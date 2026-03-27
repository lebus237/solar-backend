import { StoreDetailsDto } from '#kernel/store/application/dto/store_dto'
import { AppId } from '#shared/domain/app_id'

export interface StoreReadModel {
  storeById(storeId: AppId): Promise<StoreDetailsDto>
}
