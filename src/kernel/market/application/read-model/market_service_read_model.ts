import { MarketServiceDetailsDto } from '#kernel/market/application/dto/market_service_read_dto'

export interface MarketServiceReadModel {
  getById(marketServiceId: string): Promise<MarketServiceDetailsDto | null>
}
