import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { StoreRepository } from '#kernel/store/core/store_repository'
import { Store } from '#kernel/store/core/store'
import { UpdateStoreCommand } from '../command/update_store_command'

export class UpdateStoreHandler implements CommandHandler<UpdateStoreCommand> {
  constructor(private repository: StoreRepository) {}
  handle(command: UpdateStoreCommand): Promise<void> {
    const store = new Store(command.storeId, command.designation, command.domainUrl)
    return this.repository.save(store)
  }
}
