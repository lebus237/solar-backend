import { AddressType } from '#kernel/customer/domain/type/address_type'
import { AddressId, CustomerId } from '#shared/domain/types/branded_types'

export class Address {
  constructor(
    private id: AddressId | null,
    private customerId: CustomerId,
    private type: AddressType,
    private addressLine1: string,
    private addressLine2: string | null,
    private city: string,
    private state: string | null,
    private postalCode: string | null,
    private country: string,
    private isDefault: boolean,
    private createdAt?: Date,
    private updatedAt?: Date
  ) {}

  getId(): AddressId | null {
    return this.id
  }

  getCustomerId(): CustomerId {
    return this.customerId
  }

  getType(): AddressType {
    return this.type
  }

  getAddressLine1(): string {
    return this.addressLine1
  }

  getAddressLine2(): string | null {
    return this.addressLine2
  }

  getCity(): string {
    return this.city
  }

  getState(): string | null {
    return this.state
  }

  getPostalCode(): string | null {
    return this.postalCode
  }

  getCountry(): string {
    return this.country
  }

  getIsDefault(): boolean {
    return this.isDefault
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt
  }

  getFullAddress(): string {
    const parts = [this.addressLine1]
    if (this.addressLine2) parts.push(this.addressLine2)
    parts.push(this.city)
    if (this.state) parts.push(this.state)
    if (this.postalCode) parts.push(this.postalCode)
    parts.push(this.country)
    return parts.join(', ')
  }

  // Setters
  setAddressLine1(addressLine1: string): void {
    this.addressLine1 = addressLine1
  }

  setAddressLine2(addressLine2: string | null): void {
    this.addressLine2 = addressLine2
  }

  setCity(city: string): void {
    this.city = city
  }

  setState(state: string | null): void {
    this.state = state
  }

  setPostalCode(postalCode: string | null): void {
    this.postalCode = postalCode
  }

  setCountry(country: string): void {
    this.country = country
  }

  setType(type: AddressType): void {
    this.type = type
  }

  setDefault(isDefault: boolean): void {
    this.isDefault = isDefault
  }
}
