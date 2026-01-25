import { Command } from '#shared/application/use-cases/command'

export class UpdateProductCategoryCommand implements Command {
  readonly timestamp: Date
  constructor(
    public readonly categoryId: any,
    public readonly designation: string,
    public readonly type: 'CATEGORY' | 'TAG',
    public readonly parentId: any
  ) {
    this.timestamp = new Date()
  }
}
