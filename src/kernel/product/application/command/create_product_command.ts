import { Command } from '#shared/application/use-cases/command'

export class CreateProductCommand implements Command {
  readonly timestamp: Date

  constructor(
    public designation: string,
    public domainUrl: string
  ) {
    this.timestamp = new Date()
  }
}
