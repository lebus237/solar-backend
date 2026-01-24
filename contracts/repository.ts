import { RepositoryInterface } from '#shared/domain/repository_interface'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    StoreRepository: RepositoryInterface
    ProductRepository: RepositoryInterface
  }
}
