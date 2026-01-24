export class Store {
  constructor(
    private id: any,
    private designation: string,
    private domainName: string,
    private createdAt: any = null,
    private updatedAt: any = null
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
}
