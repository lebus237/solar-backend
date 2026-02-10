import { ApplicationService } from '@adonisjs/core/types'
import { StoreARRepository } from '#kernel/store/infrastructure/persistence/store_ar_repository'
import { ProductARRepository } from '#kernel/product/infrastructure/persistence/product_ar_repository'
import { ProductCategoryARRepository } from '#kernel/product/infrastructure/persistence/product_category_ar_repository'
import { MarketServiceARRepository } from '#kernel/market/infrastructure/persistence/market_service_ar_repository'

export default class RepositoryProvider {
  constructor(protected app: ApplicationService) {}

  public register() {
    if (this.app.nodeEnvironment !== 'test') {
      this.app.container.bind('StoreRepository', () => {
        return new StoreARRepository()
      })
      this.app.container.bind('ProductRepository', () => {
        return new ProductARRepository()
      })
      this.app.container.bind('ProductCategoryRepository', () => {
        return new ProductCategoryARRepository()
      })
      this.app.container.bind('MarketServiceRepository', () => {
        return new MarketServiceARRepository()
      })
    }
  }

  public async boot() {}
  public async ready() {}
  public async shutdown() {}
}
