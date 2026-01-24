import { Command } from '@/shared/application/use-cases/command'

export class UpdateStoreCommand implements Command {
  readonly timestamp: Date
  constructor(
    public storeId: any,
    public designation: string,
    public domainUrl: string
  ) {
    this.timestamp = new Date()
  }
}
