import { AppId } from '#shared/domain/app_id'

export class DeleteMarketServiceCommand {
  constructor(public serviceId: AppId) {}
}
