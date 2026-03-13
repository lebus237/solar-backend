import string from '@adonisjs/core/helpers/string'
import { ProductImage } from '#kernel/product/domain/entity/product_image'
import { ProductPackItem } from '#kernel/product/domain/entity/product_pack_item'
import { AppId } from '#shared/domain/app_id'

export class ProductPack {
  constructor(
    private id: AppId | null,
    private designation: string,
    private description: string | null,
    private price: number,
    private mainImage: ProductImage | null,
    private items: ProductPackItem[] = [],
    private readonly slug?: string,
    private stockQuantity: number | null = null,
    private lowStockThreshold: number = 10,
    private readonly isAvailable: boolean = false,
    private readonly isDeleted: boolean = false,
    private createdAt?: Date,
    private updatedAt?: Date
  ) {
    this.slug = slug ?? string.slug(this.designation + '-' + string.generateRandom(8)).toLowerCase()
    this.isAvailable = isAvailable ?? false
    this.isDeleted = isDeleted ?? false
    this.lowStockThreshold = lowStockThreshold ?? 10
  }

  getId(): AppId | null {
    return this.id
  }

  setId(id: AppId): void {
    this.id = id
  }

  getSlug(): string | undefined {
    return this.slug
  }

  getDesignation(): string {
    return this.designation
  }

  getDescription(): string | null {
    return this.description
  }

  getPrice(): number {
    return this.price
  }

  getMainImage(): ProductImage | null {
    return this.mainImage
  }

  getItems(): ProductPackItem[] {
    return this.items
  }

  getStockQuantity(): number | null {
    return this.stockQuantity
  }

  getLowStockThreshold(): number {
    return this.lowStockThreshold
  }

  getIsAvailable(): boolean {
    return this.isAvailable
  }

  getIsDeleted(): boolean {
    return this.isDeleted
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt
  }

  setStockQuantity(quantity: number | null): void {
    this.stockQuantity = quantity
  }

  setLowStockThreshold(threshold: number): void {
    this.lowStockThreshold = threshold
  }

  /**
   * Check if the pack has its own stock tracking
   */
  hasOwnStock(): boolean {
    return this.stockQuantity !== null
  }

  /**
   * Check if pack is low stock (only applies if has own stock)
   */
  isLowStock(): boolean {
    if (!this.hasOwnStock()) {
      return false
    }
    return this.stockQuantity! > 0 && this.stockQuantity! <= this.lowStockThreshold
  }

  /**
   * Check if pack is out of stock (only applies if has own stock)
   */
  isOutOfStock(): boolean {
    if (!this.hasOwnStock()) {
      return false
    }
    return this.stockQuantity! <= 0
  }

  /**
   * Get effective stock based on pack's own stock or calculated from items
   * Returns null if pack has no stock and items don't have stock info
   */
  getEffectiveStock(): number | null {
    if (this.hasOwnStock()) {
      return this.stockQuantity
    }

    // Calculate from items if they have product stock info
    if (this.items.length === 0) {
      return null
    }

    let minStock: number | null = null
    for (const item of this.items) {
      const product = item.getProduct()
      if (!product) {
        return null
      }
      const productStock = product.getStockQuantity()
      const availableFromProduct = Math.floor(productStock / item.getQuantity())

      if (minStock === null || availableFromProduct < minStock) {
        minStock = availableFromProduct
      }
    }

    return minStock
  }
}
