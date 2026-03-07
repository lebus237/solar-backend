import { ApplicationService } from '@adonisjs/core/types'
import { StoreARRepository } from '#kernel/store/infrastructure/persistence/store_ar_repository'
import { ProductARRepository } from '#kernel/product/infrastructure/persistence/aggregates/product_ar_repository'
import { ProductCategoryARRepository } from '#kernel/product/infrastructure/persistence/aggregates/product_category_ar_repository'
import { MarketServiceARRepository } from '#kernel/market/infrastructure/persistence/market_service_ar_repository'
import { ImageMediaARRepository } from '#kernel/medias/infrastructure/persistence/image_media_ar_repository'
import { StockMovementARRepository } from '#kernel/product/infrastructure/persistence/aggregates/stock_movement_ar_repository'
import { CustomerARRepository } from '#kernel/customer/infrastructure/persistence/customer_ar_repository'
import { AddressARRepository } from '#kernel/customer/infrastructure/persistence/address_ar_repository'
import { OrderARRepository } from '#kernel/order/infrastructure/persistence/order_ar_repository'
import { ProductImageARRepository } from '#kernel/product/infrastructure/persistence/aggregates/product_image_ar_repository'
import { ProductARCollection } from '#kernel/product/infrastructure/persistence/projections/product_ar_collection'
import { ProductARReadModel } from '#kernel/product/infrastructure/persistence/projections/product_ar_read_model'
import { ProductCategoryARCollection } from '#kernel/product/infrastructure/persistence/projections/product_category_ar_collection'
import { ProductCategoryARReadModel } from '#kernel/product/infrastructure/persistence/projections/product_category_ar_read_model'
import { StockARCollection } from '#kernel/product/infrastructure/persistence/projections/stock_ar_collection'
import { StockARReadModel } from '#kernel/product/infrastructure/persistence/projections/stock_ar_read_model'

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
      this.app.container.bind('ImageMediaRepository', () => {
        return new ImageMediaARRepository()
      })
      this.app.container.bind('StockMovementRepository', () => {
        return new StockMovementARRepository()
      })
      this.app.container.bind('CustomerRepository', () => {
        return new CustomerARRepository()
      })
      this.app.container.bind('AddressRepository', () => {
        return new AddressARRepository()
      })
      this.app.container.bind('OrderRepository', () => {
        return new OrderARRepository()
      })
      this.app.container.bind('ProductImageRepository', () => {
        return new ProductImageARRepository()
      })
      this.app.container.bind('ProductCollection', async () => {
        const mediaUploadService = await this.app.container.make('MediaUploadService')

        return new ProductARCollection(mediaUploadService)
      })
      this.app.container.bind('ProductReadModel', async () => {
        const mediaUploadService = await this.app.container.make('MediaUploadService')

        return new ProductARReadModel(mediaUploadService)
      })
      this.app.container.bind('ProductCategoryCollection', async () => {
        const mediaUploadService = await this.app.container.make('MediaUploadService')

        return new ProductCategoryARCollection(mediaUploadService)
      })
      this.app.container.bind('ProductCategoryReadModel', async () => {
        return new ProductCategoryARReadModel()
      })
      this.app.container.bind('StockCollection', () => {
        return new StockARCollection()
      })
      this.app.container.bind('StockReadModel', () => {
        return new StockARReadModel()
      })
    }
  }

  public async boot() {}
  public async ready() {}
  public async shutdown() {}
}
