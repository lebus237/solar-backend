import { Address } from '#kernel/customer/domain/entity/address'
import { AppId } from '#shared/domain/app_id'

export class Customer {
  constructor(
    private id: AppId | null,
    private userId: AppId | null,
    private firstName: string,
    private lastName: string,
    private phone: string,
    private email?: string,
    private addresses: Address[] = [],
    private createdAt?: Date,
    private updatedAt?: Date
  ) {}

  getId(): AppId | null {
    return this.id
  }

  setId(id: AppId): void {
    this.id = id
  }

  getUserId(): AppId | null {
    return this.userId
  }

  getFirstName(): string {
    return this.firstName
  }

  getLastName(): string {
    return this.lastName
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  getEmail(): string | undefined {
    return this.email
  }

  getPhone(): string {
    return this.phone
  }

  getAddresses(): Address[] {
    return this.addresses
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt
  }

  // Setters
  setFirstName(firstName?: string): void {
    this.firstName = firstName ?? this.firstName
  }

  setLastName(lastName?: string): void {
    this.lastName = lastName ?? this.lastName
  }

  setEmail(email?: string): void {
    this.email = email
  }

  setPhone(phone?: string): void {
    this.phone = phone ?? this.phone
  }
}
