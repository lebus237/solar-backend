import { CommandBus } from '#shared/infrastructure/bus/command_bus'
import { QueryBus } from '#shared/infrastructure/bus/query_bus'
import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { MediaManagerInterface } from '#shared/application/services/upload/media_manager_interface'
import type { CustomerRepository } from '#kernel/customer/domain/repository/customer_repository'
import type { AddressRepository } from '#kernel/customer/domain/repository/address_repository'
import type { ProductCollection, ProductReadModel } from '#kernel/product/application/services/product_read_repository'
import type {
  ProductCategoryCollection,
  ProductCategoryReadModel,
} from '#kernel/product/application/services/product_category_read_repository'
import type { StockCollection, StockReadModel } from '#kernel/product/application/services/stock_read_repository'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    'CQRS/CommandBus': CommandBus
    'CQRS/QueryBus': QueryBus

    //REPOSITORY
    'StoreRepository': RepositoryInterface
    'ProductRepository': RepositoryInterface
    'ProductCategoryRepository': RepositoryInterface
    'MarketServiceRepository': RepositoryInterface
    'ImageMediaRepository': RepositoryInterface
    'StockMovementRepository': RepositoryInterface
    'CustomerRepository': CustomerRepository
    'AddressRepository': AddressRepository
    'OrderRepository': RepositoryInterface
    'ProductImageRepository': RepositoryInterface
    'ProductCollection': ProductCollection
    'ProductReadModel': ProductReadModel
    'ProductCategoryCollection': ProductCategoryCollection
    'ProductCategoryReadModel': ProductCategoryReadModel
    'StockCollection': StockCollection
    'StockReadModel': StockReadModel

    //SERVICE
    'MediaUploadService': MediaManagerInterface
  }
}
