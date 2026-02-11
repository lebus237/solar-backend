import { CommandBus } from '#shared/infrastructure/bus/command_bus'
import { QueryBus } from '#shared/infrastructure/bus/query_bus'
import { RepositoryInterface } from '#shared/domain/repository_interface'
import { MediaUploader } from '#shared/application/services/upload/media_uploader'

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

    //SERVICE
    'MediaUploadService': MediaUploader
  }
}
