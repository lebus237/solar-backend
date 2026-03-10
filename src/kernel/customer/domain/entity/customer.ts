import { Address } from '#kernel/customer/domain/entity/address'
import { CustomerId, UserId } from '#shared/domain/types/branded_types'

export class Customer {
  constructor(
    private id: CustomerId | null,
    private userId: UserId | null,
    private firstName: string,
    private lastName: string,
    private phone: string,
    private email?: string,
    private addresses: Address[] = [],
    private createdAt?: Date,
    private updatedAt?: Date
  ) {}

  getId(): CustomerId | null {
    return this.id
  }

  getUserId(): UserId | null {
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
