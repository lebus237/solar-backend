import { CommandBus } from '@/shared/infrastructure/bus/command_bus'
import { ApplicationService } from '@adonisjs/core/types'
import { UpdateStoreHandler } from '@/kernel/store/application/command_handler/update_store_handler'
import { CreateStoreHandler } from '@/kernel/store/application/command_handler/create_store_handler'

export default class CqrsProvider {
  constructor(protected app: ApplicationService) {}

  public register() {
    this.app.container.singleton('CQRS/CommandBus', () => {
      const commandBus = new CommandBus(this.app)

      commandBus.register('CreateStoreCommand', CreateStoreHandler, ['StoreRepository'])
      commandBus.register('UpdateStoreCommand', UpdateStoreHandler, ['ProductRepository'])

      return commandBus
    })

    // this.app.container.singleton('CQRS/QueryBus', () => {
    //   const queryBus = new QueryBus()
    //
    //   // Register query handlers
    //   // queryBus.register('GetUserByIdQuery', new GetUserByIdQueryHandler())
    //   // queryBus.register('GetAllUsersQuery', new GetAllUsersQueryHandler())
    //
    //   return queryBus
    // })
  }

  public async boot() {}
  public async ready() {}
  public async shutdown() {}
}
