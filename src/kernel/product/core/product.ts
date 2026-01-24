export class Product {
  constructor(
    private id: any,
    private designation: string,
    private domainName: string,
    private createdAt: Date | null = null,
    private updatedAt: Date | null = null
  ) {}

  getId(): any {
    return this.id
  }

  getDomainName(): string {
    return this.domainName
  }

  getDesignation(): string {
    return this.designation
  }

  getCreatedAt(): Date | null {
    return this.createdAt
  }
  getUpdatedAt(): Date | null {
    return this.updatedAt
  }
}
