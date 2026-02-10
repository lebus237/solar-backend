import { IdentifierInterface } from '#shared/domain/identifier'
import { RepositoryInterface } from '#shared/domain/repository_interface'
import { MarketService } from '../entity/market_service'

export interface MarketServiceRepository extends RepositoryInterface {
  save(entity: MarketService): Promise<void>
  getById(id: IdentifierInterface): Promise<MarketService>
  delete(id: IdentifierInterface): Promise<void>
}
