import { CommandBus } from '#shared/infrastructure/bus/command_bus'
import { QueryBus } from '#shared/infrastructure/bus/query_bus'
import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { MediaManagerInterface } from '#shared/application/services/upload/media_manager_interface'
import type { CustomerRepository } from '#kernel/customer/domain/repository/customer_repository'
import type { AddressRepository } from '#kernel/customer/domain/repository/address_repository'
import { ProductCollection } from '#kernel/product/application/collection/product_collection'
import { ProductReadModel } from '#kernel/product/application/read-model/product_read_model'
import { ProductCategoryCollection } from '#kernel/product/application/collection/product_category_collection'
import { ProductCategoryReadModel } from '#kernel/product/application/read-model/product_category_read_model'
import { StockCollection } from '#kernel/product/application/collection/stock_collection'
import { StockReadModel } from '#kernel/product/application/read-model/stock_read_model'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    'CQRS/CommandBus': CommandBus
    'CQRS/QueryBus': QueryBus

    //AGGREGATES REPOSITORY
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

    // READ MODELS
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
