import { OrderStatus } from '#kernel/order/domain/type/order_status'
import { OrderItem } from '#kernel/order/domain/entity/order_item'
import { OrderId, CustomerId } from '#shared/domain/types/branded_types'

export class Order {
  constructor(
    private id: OrderId | null,
    private orderNumber: string,
    private customerId: CustomerId | null,
    private status: OrderStatus,
    // Shipping Address
    private shippingFirstName: string,
    private shippingLastName: string,
    private shippingPhone: string | null,
    private shippingAddressLine1: string,
    private shippingAddressLine2: string | null,
    private shippingCity: string,
    private shippingState: string | null,
    private shippingPostalCode: string | null,
    private shippingCountry: string,
    // Pricing
    private subtotal: number,
    private shippingFee: number,
    private total: number,
    // Notes
    private customerNotes: string | null,
    private adminNotes: string | null,
    // Items
    private items: OrderItem[] = [],
    // Status timestamps
    private confirmedAt?: Date,
    private shippedAt?: Date,
    private deliveredAt?: Date,
    private cancelledAt?: Date,
    private createdAt?: Date,
    private updatedAt?: Date
  ) {}

  getId(): OrderId | null {
    return this.id
  }

  getOrderNumber(): string {
    return this.orderNumber
  }

  getCustomerId(): CustomerId | null {
    return this.customerId
  }

  getStatus(): OrderStatus {
    return this.status
  }

  setStatus(status: OrderStatus): void {
    this.status = status
  }

  getShippingFirstName(): string {
    return this.shippingFirstName
  }

  getShippingLastName(): string {
    return this.shippingLastName
  }

  getShippingPhone(): string | null {
    return this.shippingPhone
  }

  getShippingAddressLine1(): string {
    return this.shippingAddressLine1
  }

  getShippingAddressLine2(): string | null {
    return this.shippingAddressLine2
  }

  getShippingCity(): string {
    return this.shippingCity
  }

  getShippingState(): string | null {
    return this.shippingState
  }

  getShippingPostalCode(): string | null {
    return this.shippingPostalCode
  }

  getShippingCountry(): string {
    return this.shippingCountry
  }

  getSubtotal(): number {
    return this.subtotal
  }

  getShippingFee(): number {
    return this.shippingFee
  }

  getTotal(): number {
    return this.total
  }

  getCustomerNotes(): string | null {
    return this.customerNotes
  }

  getAdminNotes(): string | null {
    return this.adminNotes
  }

  setAdminNotes(notes: string | null): void {
    this.adminNotes = notes
  }

  getItems(): OrderItem[] {
    return this.items
  }

  getConfirmedAt(): Date | undefined {
    return this.confirmedAt
  }

  setConfirmedAt(date: Date): void {
    this.confirmedAt = date
  }

  getShippedAt(): Date | undefined {
    return this.shippedAt
  }

  setShippedAt(date: Date): void {
    this.shippedAt = date
  }

  getDeliveredAt(): Date | undefined {
    return this.deliveredAt
  }

  setDeliveredAt(date: Date): void {
    this.deliveredAt = date
  }

  getCancelledAt(): Date | undefined {
    return this.cancelledAt
  }

  setCancelledAt(date: Date): void {
    this.cancelledAt = date
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt
  }
}
