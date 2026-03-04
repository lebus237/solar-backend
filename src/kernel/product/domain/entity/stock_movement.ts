import { StockOperationType } from '../type/stock_operation_type'

export class StockMovement {
  constructor(
    private id: string | null,
    private productId: string,
    private operationType: StockOperationType,
    private quantity: number,
    private previousQuantity: number,
    private newQuantity: number,
    private reason?: string | null,
    private createdAt?: Date
  ) {}

  getId(): string | null {
    return this.id
  }

  getProductId(): string {
    return this.productId
  }

  getOperationType(): StockOperationType {
    return this.operationType
  }

  getQuantity(): number {
    return this.quantity
  }

  getPreviousQuantity(): number {
    return this.previousQuantity
  }

  getNewQuantity(): number {
    return this.newQuantity
  }

  getReason(): string | null | undefined {
    return this.reason
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt
  }
}
