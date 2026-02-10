import { MarketServiceRepository } from '#kernel/market/core/repository/market_service_repository'
import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { DeleteMarketServiceCommand } from '../command/delete_market_service.command'

export class DeleteMarketServiceHandler implements CommandHandler<DeleteMarketServiceCommand> {
  constructor(public repository: MarketServiceRepository) {}

  async handle(command: DeleteMarketServiceCommand): Promise<void> {
    this.repository.delete(command.serviceId)
  }
}
