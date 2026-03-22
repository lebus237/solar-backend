import { StoreStatusEnum } from '#kernel/store/domain/types/store_status'
import { Command } from '#shared/application/use-cases/command'
import { AppId } from '#shared/domain/app_id'

export class ChangeStoreStatusCommand implements Command {
  readonly timestamp: Date
  constructor(
    public storeId: AppId,
    public status: StoreStatusEnum,
    public reason?: string
  ) {
    this.timestamp = new Date()
  }
}
