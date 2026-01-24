import { QueryHandler } from '@/shared/application/use-cases/query_handler'
import { Query } from '@/shared/application/use-cases/query'

export class QueryBus {
  private handlers: Map<string, QueryHandler<any, any>> = new Map()

  register<TQuery extends Query, TResult>(
    queryName: string,
    handler: QueryHandler<TQuery, TResult>
  ): void {
    this.handlers.set(queryName, handler)
  }

  async execute<TQuery extends Query, TResult>(query: TQuery): Promise<TResult> {
    const queryName = query.constructor.name
    const handler = this.handlers.get(queryName)

    if (!handler) {
      throw new Error(`No handler registered for query: ${queryName}`)
    }

    return handler.handle(query)
  }
}
