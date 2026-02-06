import string from '@adonisjs/core/helpers/string'

export class Product {
  constructor(
    private id: any,
    private designation: string,
    private categoryId: any,
    private description: string,
    private pictureUrl: string,
    private price: number,
    private brand?: string,
    private readonly slug?: string,
    private readonly isAvailable?: boolean,
    private readonly isDeleted?: boolean,
    private createdAt?: Date,
    private updatedAt?: Date
  ) {
    this.slug = slug ?? string.slug(this.designation + '-' + string.generateRandom(8)).toLowerCase()
    this.isAvailable = isAvailable ?? false
    this.isDeleted = isDeleted ?? false
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
}
