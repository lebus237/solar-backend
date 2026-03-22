import { StoreStatus, StoreStatusEnum } from '#kernel/store/domain/types/store_status'
import { BusinessHours } from '#shared/domain/value-objects/business_hours'
import { DomainError } from '#shared/domain/errors/domain_error'
import { AppId } from '#shared/domain/app_id'
import { PhoneNumber } from '#shared/domain/value-objects/phone_number'
import { Address } from '#shared/domain/value-objects/address'

// TODO: Add managerId after user management system is complete
export class Store {
  constructor(
    private id: AppId | null,
    private designation: string,
    private address: Address,
    private phoneContact1: PhoneNumber,
    private businessHours: Array<BusinessHours>,
    private whatsAppContact: PhoneNumber | null,
    private phoneContact2: PhoneNumber | null = null,
    private status: StoreStatus = { status: StoreStatusEnum.INACTIVE },
    private createdAt: Date | undefined = undefined,
    private updatedAt: Date | undefined = undefined
  ) {
    if (
      businessHours.some((ha, index) =>
        businessHours.some((hb, i) => BusinessHours.equalDays(ha, hb) && index !== i)
      )
    ) {
      let seed: BusinessHours = businessHours[0]
      const conflicting: BusinessHours = businessHours.find((ha, index) => {
        seed = ha
        return businessHours.some((hb, i) => BusinessHours.equalDays(ha, hb) && index !== i)
      })!

      throw new DomainError(
        'STORE_CONFLICTING_BUSINESS_HOURS',
        `Conflicting business hours : ${conflicting.toString()} and ${seed?.toString()}`
      )
    }
  }

  changeStatus(status: StoreStatusEnum, reason?: string) {
    this.status = { status, reason }
  }

  getId(): any {
    return this.id
  }

  getDesignation(): string {
    return this.designation
  }

  getAddress(): Address {
    return this.address
  }

  getBusinessHours(): Array<BusinessHours> {
    return this.businessHours
  }

  getWhatsAppContact(): PhoneNumber | null {
    return this.whatsAppContact
  }

  getPhoneContact1(): PhoneNumber {
    return this.phoneContact1
  }

  getPhoneContact2(): PhoneNumber | null {
    return this.phoneContact2
  }

  getStatus(): StoreStatus {
    return this.status
  }

  getCreatedAt(): any {
    return this.createdAt
  }
  getUpdatedAt(): any {
    return this.updatedAt
  }
}
