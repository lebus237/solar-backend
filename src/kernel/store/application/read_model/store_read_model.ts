import { StoreReadDto } from '#kernel/store/application/dto/store_dto'

export interface StoreReadModel {
  storeById(storeId: string): Promise<StoreReadDto>
}
