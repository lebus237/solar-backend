import { AppId } from '#shared/domain/app_id'
import { RepositoryInterface } from '#shared/domain/repository_interface'
import { MarketService } from '../entity/market_service'

export interface MarketServiceRepository extends RepositoryInterface {
  save(entity: MarketService): Promise<void>
  getById(id: AppId): Promise<MarketService>
  delete(id: AppId): Promise<void>
}
