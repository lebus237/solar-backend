import { ApplicationService } from '@adonisjs/core/types'
import { StoreARRepository } from '#kernel/store/infrastructure/persistence/store_ar_repository'
import { ProductARRepository } from '#kernel/product/infrastructure/persistence/product_ar_repository'

export default class RepositoryProvider {
  constructor(protected app: ApplicationService) {}

  public register() {
    this.app.container.bind('StoreRepository', () => {
      return new StoreARRepository()
    })
    this.app.container.bind('ProductRepository', () => {
      return new ProductARRepository()
    })
  }

  public async boot() {}
  public async ready() {}
  public async shutdown() {}
}
