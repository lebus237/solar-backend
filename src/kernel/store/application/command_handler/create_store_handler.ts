import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CreateStoreCommand } from '#kernel/store/application/command/create_store_command'
import { Store } from '#kernel/store/domain/entity/store'
import { StoreRepository } from '#kernel/store/domain/repository/store_repository'

export class CreateStoreHandler implements CommandHandler<CreateStoreCommand> {
  constructor(private repository: StoreRepository) {}
  handle(command: CreateStoreCommand): Promise<void> {
    const store = new Store(
      null,
      command.designation,
      command.address,
      command.phoneContact1,
      command.businessHours,
      command.whatsAppContact ?? null,
      command.phoneContact2 ?? null
    )
    return this.repository.save(store)
  }
}
