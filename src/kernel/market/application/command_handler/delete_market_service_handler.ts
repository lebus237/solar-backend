import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { DeleteMarketServiceCommand } from '#kernel/market/application/command/delete_market_service_command'
import { MarketServiceRepository } from '#kernel/market/domain/repository/market_service_repository'

export class DeleteMarketServiceHandler implements CommandHandler<DeleteMarketServiceCommand> {
  constructor(private repository: MarketServiceRepository) {}

  async handle(command: DeleteMarketServiceCommand): Promise<void> {
    await this.repository.delete(command.serviceId)
  }
}
