import { Command } from '#shared/application/use-cases/command'

export class UpdateCustomerCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phone: string,
    public readonly email?: string
  ) {
    this.timestamp = new Date()
  }
}
