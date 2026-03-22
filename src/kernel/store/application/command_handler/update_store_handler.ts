import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { StoreRepository } from '#kernel/store/domain/repository/store_repository'
import { Store } from '#kernel/store/domain/entity/store'
import { UpdateStoreCommand } from '#kernel/store/application/command/update_store_command'
import { NotFoundApplicationError } from '#shared/application/errors/not_found_application_error'

export class UpdateStoreHandler implements CommandHandler<UpdateStoreCommand> {
  constructor(private repository: StoreRepository) {}

  async handle(command: UpdateStoreCommand): Promise<void> {
    const store = await this.repository.findById(command.storeId)

    if (!store) {
      throw new NotFoundApplicationError(`Store with id ${command.storeId} not found`)
    }

    const updatedStore = new Store(
      command.storeId,
      command.designation,
      command.address,
      command.phoneContact1,
      command.businessHours,
      command.whatsAppContact,
      command.phoneContact2,
      store.getStatus(),
      store.getCreatedAt()
    )
    return this.repository.save(updatedStore)
  }
}
