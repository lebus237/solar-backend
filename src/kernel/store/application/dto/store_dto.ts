import { Address } from '#shared/domain/value-objects/address'
import { BusinessHours } from '#shared/domain/value-objects/business_hours'
import { PhoneNumber } from '#shared/domain/value-objects/phone_number'

export interface StoreDetailsDto {
  id: string
  designation: string
  phoneNumber1: PhoneNumber
  phoneNumber2?: PhoneNumber
  whatsappNumber?: PhoneNumber
  businessHours: Array<ReturnType<typeof BusinessHours.toJson>>
  address: ReturnType<typeof Address.toJson>
  createdAt: Date
  updatedAt: Date
}

export interface StoreListItemDto {
  id: string
  designation: string
  phoneNumber1: string
  address: ReturnType<typeof Address.toJson>
  createdAt: unknown
  updatedAt: unknown
}
