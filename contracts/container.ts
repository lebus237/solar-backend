import { CommandBus } from '#shared/infrastructure/bus/command_bus'
import { QueryBus } from '#shared/infrastructure/bus/query_bus'
import { RepositoryInterface } from '#shared/domain/repository_interface'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    'CQRS/CommandBus': CommandBus
    'CQRS/QueryBus': QueryBus

    'StoreRepository': RepositoryInterface
    'ProductRepository': RepositoryInterface
    'ProductCategoryRepository': RepositoryInterface
    'MarketServiceRepository': RepositoryInterface
  }
}
