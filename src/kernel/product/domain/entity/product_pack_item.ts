import { Product } from '#kernel/product/domain/entity/product'
import { AppId } from '#shared/domain/app_id'

export class ProductPackItem {
  constructor(
    private id: AppId,
    private productId: AppId,
    private quantity: number,
    private product?: Product,
    private sortOrder: number = 0
  ) {}

  getId(): AppId {
    return this.id
  }

  getProductId(): AppId {
    return this.productId
  }

  getQuantity(): number {
    return this.quantity
  }

  getProduct(): Product | undefined {
    return this.product
  }

  getSortOrder(): number {
    return this.sortOrder
  }

  setQuantity(quantity: number): void {
    this.quantity = quantity
  }

  setSortOrder(sortOrder: number): void {
    this.sortOrder = sortOrder
  }
}
