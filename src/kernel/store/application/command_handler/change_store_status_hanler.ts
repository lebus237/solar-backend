import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { ChangeStoreStatusCommand } from '#kernel/store/application/command/change_store_status'
import { StoreRepository } from '#kernel/store/domain/repository/store_repository'
import { NotFoundApplicationError } from '#shared/application/errors/not_found_application_error'

export class ChangeStoreStatusHandler implements CommandHandler<ChangeStoreStatusCommand> {
  constructor(private readonly storeRepository: StoreRepository) {}

  async handle(command: ChangeStoreStatusCommand): Promise<void> {
    const store = await this.storeRepository.findById(command.storeId)

    if (!store) {
      throw new NotFoundApplicationError(`Store with id ${command.storeId} not found`)
    }
    store.changeStatus(command.status, command.reason)
    await this.storeRepository.save(store)
  }
}
