import { Command } from '#shared/application/use-cases/command'
import { Address } from '#shared/domain/value-objects/address'
import { BusinessHours } from '#shared/domain/value-objects/business_hours'
import { PhoneNumber } from '#shared/domain/value-objects/phone_number'

export class CreateStoreCommand implements Command {
  readonly timestamp: Date

  constructor(
    public designation: string,
    public address: Address,
    public phoneContact1: PhoneNumber,
    public businessHours: Array<BusinessHours>,
    public whatsAppContact?: PhoneNumber,
    public phoneContact2?: PhoneNumber
  ) {
    this.timestamp = new Date()
  }
}
