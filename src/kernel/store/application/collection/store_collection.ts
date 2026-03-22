import { StoreReadDto } from '#kernel/store/application/dto/store_dto'

export interface StoreCollection {
  collection(): Promise<StoreReadDto[]>
  forSelect(): Promise<StoreReadDto[]>
}
