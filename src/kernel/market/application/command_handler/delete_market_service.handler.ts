import { IdentifierInterface } from '#shared/domain/identifier'

export class DeleteMarketServiceCommand {
  constructor(public serviceId: IdentifierInterface) {}
}
