import { CommandHandler } from '@/shared/application/use-cases/command_handler'
import { CreateStoreCommand } from '@/kernel/store/application/command/create_store_command'
import { Store } from '@/kernel/store/core/store'
import { StoreRepository } from '@/kernel/store/core/store_repository'

export class CreateStoreHandler implements CommandHandler<CreateStoreCommand> {
  constructor(private repository: StoreRepository) {}
  handle(command: CreateStoreCommand): Promise<void> {
    const store = new Store(null, command.designation, command.domainUrl)
    return this.repository.save(store)
  }
}
