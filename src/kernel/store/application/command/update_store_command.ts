import { Command } from '#shared/application/use-cases/command'
import { AppId } from '#shared/domain/app_id'
import { Address } from '#shared/domain/value-objects/address'
import { BusinessHours } from '#shared/domain/value-objects/business_hours'
import { PhoneNumber } from '#shared/domain/value-objects/phone_number'

export class UpdateStoreCommand implements Command {
  readonly timestamp: Date
  constructor(
    public storeId: AppId,
    public designation: string,
    public address: Address,
    public phoneContact1: PhoneNumber,
    public businessHours: Array<BusinessHours>,
    public whatsAppContact: PhoneNumber | null = null,
    public phoneContact2: PhoneNumber | null = null
  ) {
    this.timestamp = new Date()
  }
}
