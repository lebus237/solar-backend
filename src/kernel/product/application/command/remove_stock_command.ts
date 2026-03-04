import { Command } from '#shared/application/use-cases/command'

export class RemoveStockCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly reason?: string
  ) {
    this.timestamp = new Date()
  }
}
