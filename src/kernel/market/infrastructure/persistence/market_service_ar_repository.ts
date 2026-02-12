import { MarketService } from '#kernel/market/domain/entity/market_service'
import { MarketServiceRepository } from '#kernel/market/domain/repository/market_service_repository'
import { AppId } from '#shared/domain/app_id'

export class MarketServiceARRepository implements MarketServiceRepository {
  save(entity: MarketService): Promise<void> {
    console.log('Saving market service:', entity)
    return Promise.resolve()
  }

  getById(id: AppId): Promise<MarketService> {
    console.log('Getting market service by ID:', id)
    throw new Error('Method not implemented.')
  }

  delete(id: AppId): Promise<void> {
    console.log('Deleting market service by ID:', id)
    throw new Error('Method not implemented.')
  }
}
