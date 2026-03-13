import string from '@adonisjs/core/helpers/string'
import { AppId } from '#shared/domain/app_id'

export class ProductCategory {
  constructor(
    private id: AppId | null,
    private designation: string,
    private type: 'CATEGORY' | 'TAG' = 'CATEGORY',
    private parentId: AppId | null = null,
    private slug: string | null = null,
    private createdAt?: Date,
    private updatedAt?: Date
  ) {
    if (!slug) {
      this.slug = string.slug(this.designation + '-' + string.generateRandom(8)).toLowerCase()
    }
  }

  getId(): AppId | null {
    return this.id
  }

  setId(id: AppId): void {
    this.id = id
  }

  getParentId(): AppId | null {
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
