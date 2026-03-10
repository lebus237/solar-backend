import string from '@adonisjs/core/helpers/string'
import { ProductCategoryId } from '#shared/domain/types/branded_types'

export class ProductCategory {
  constructor(
    private id: ProductCategoryId | null,
    private designation: string,
    private type: 'CATEGORY' | 'TAG' = 'CATEGORY',
    private parentId: ProductCategoryId | null = null,
    private slug: string | null = null,
    private createdAt?: Date,
    private updatedAt?: Date
  ) {
    if (!slug) {
      this.slug = string.slug(this.designation + '-' + string.generateRandom(8)).toLowerCase()
    }
  }

  getId(): ProductCategoryId | null {
    return this.id
  }

  getParentId(): ProductCategoryId | null {
    return this.parentId
  }

  getSlug(): string | null {
    return this.slug
  }

  getDesignation(): string {
    return this.designation
  }

  getType(): 'CATEGORY' | 'TAG' {
    return this.type
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt
  }
  getUpdatedAt(): Date | undefined {
    return this.updatedAt
  }
}
