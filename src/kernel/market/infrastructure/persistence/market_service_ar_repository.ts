import { MarketService } from '#kernel/market/core/entity/market_service'
import { MarketServiceRepository } from '#kernel/market/core/repository/market_service_repository'
import { IdentifierInterface } from '#shared/domain/identifier'

export class MarketServiceARRepository implements MarketServiceRepository {
  save(entity: MarketService): Promise<void> {}

  getById(id: IdentifierInterface): Promise<MarketService> {}

  delete(id: IdentifierInterface): Promise<void> {}
}
