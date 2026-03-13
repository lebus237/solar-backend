import string from '@adonisjs/core/helpers/string'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'
import { ProductImage } from '#kernel/product/domain/entity/product_image'
import { AppId } from '#shared/domain/app_id'

export class Product {
  constructor(
    private id: AppId | null,
    private designation: string,
    private category: ProductCategory,
    private description: string,
    private price: number,
    private mainImage: ProductImage,
    private images: ProductImage[] = [],
    private readonly slug?: string,
    private brand?: string,
    private stockQuantity: number = 0,
    private lowStockThreshold: number = 10,
    private readonly isAvailable?: boolean,
    private readonly isDeleted?: boolean,
    private createdAt?: Date,
    private updatedAt?: Date
  ) {
    this.slug = slug ?? string.slug(this.designation + '-' + string.generateRandom(8)).toLowerCase()
    this.isAvailable = isAvailable ?? false
    this.isDeleted = isDeleted ?? false
    this.stockQuantity = stockQuantity ?? 0
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

  getIsAvailable(): boolean | undefined {
    return this.isAvailable
  }

  getIsDeleted(): boolean | undefined {
    return this.isDeleted
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt
  }

  getMainImage(): ProductImage {
    return this.mainImage
  }

  getImages(): ProductImage[] {
    return this.images
  }

  getStockQuantity(): number {
    return this.stockQuantity
  }

  getLowStockThreshold(): number {
    return this.lowStockThreshold
  }

  getDesignation(): string {
    return this.designation
  }

  getCategory(): ProductCategory {
    return this.category
  }

  getDescription(): string {
    return this.description
  }

  getPrice(): number {
    return this.price
  }

  getBrand(): string | undefined {
    return this.brand
  }

  setStockQuantity(quantity: number): void {
    this.stockQuantity = quantity
  }

  setLowStockThreshold(threshold: number): void {
    this.lowStockThreshold = threshold
  }

  isLowStock(): boolean {
    return this.stockQuantity > 0 && this.stockQuantity <= this.lowStockThreshold
  }

  isOutOfStock(): boolean {
    return this.stockQuantity <= 0
  }
}
