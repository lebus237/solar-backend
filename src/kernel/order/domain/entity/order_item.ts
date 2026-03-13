import { AppId } from '#shared/domain/app_id'

export class OrderItem {
  constructor(
    private id: AppId | null,
    private orderId: AppId | null,
    private productId: AppId | null,
    private productName: string,
    private productSlug: string | null,
    private quantity: number,
    private unitPrice: number,
    private totalPrice: number,
    private createdAt?: Date
  ) {}

  getId(): AppId | null {
    return this.id
  }

  getOrderId(): AppId | null {
    return this.orderId
  }

  setOrderId(orderId: AppId): void {
    this.orderId = orderId
  }

  getProductId(): AppId | null {
    return this.productId
  }

  getProductName(): string {
    return this.productName
  }

  getProductSlug(): string | null {
    return this.productSlug
  }

  getQuantity(): number {
    return this.quantity
  }

  getUnitPrice(): number {
    return this.unitPrice
  }

  getTotalPrice(): number {
    return this.totalPrice
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt
  }
}
