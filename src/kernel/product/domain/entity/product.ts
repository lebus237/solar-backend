import string from '@adonisjs/core/helpers/string'

export interface ProductImage {
  id: string
  url: string | null
  alt: string | null
  title: string | null
}

export class Product {
  constructor(
    private id: any,
    private designation: string,
    private mainImageId: any,
    private categoryId: any,
    private description: string,
    private price: number,
    private brand?: string,
    private readonly slug?: string,
    private readonly isAvailable?: boolean,
    private readonly isDeleted?: boolean,
    private createdAt?: Date,
    private updatedAt?: Date,
    private mainImageUrl: string | null = null,
    private categoryName: string | null = null,
    private images: ProductImage[] = [],
    private stockQuantity: number = 0,
    private lowStockThreshold: number = 10
  ) {
    this.slug = slug ?? string.slug(this.designation + '-' + string.generateRandom(8)).toLowerCase()
    this.isAvailable = isAvailable ?? false
    this.isDeleted = isDeleted ?? false
    this.stockQuantity = stockQuantity ?? 0
    this.lowStockThreshold = lowStockThreshold ?? 10
  }

  getId(): any {
    return this.id
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

  getCreatedAt(): any {
    return this.createdAt
  }

  getUpdatedAt(): any {
    return this.updatedAt
  }

  getMainImageId(): any {
    return this.mainImageId
  }

  getMainImageUrl(): string | null {
    return this.mainImageUrl
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
