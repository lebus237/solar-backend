import { Command } from '#shared/application/use-cases/command'
import app from '@adonisjs/core/services/app'
import { Query } from '#shared/application/use-cases/query'
import { ContainerBindings } from '@adonisjs/core/types'
import { QuerySearch } from '#shared/application/query-options/query_search'
import { Pagination } from '#shared/application/query-options/pagination'
import _ from 'lodash'
import { Sort } from '#shared/application/query-options/sort'

export class AppAbstractController {
  protected async handleCommand<ReturnType>(command: Command) {
    const bus = await app.container.make('CQRS/CommandBus')

    return await bus.execute<Command, ReturnType>(command)
  }

  protected async handleQuery(command: Query) {
    const bus = await app.container.make('CQRS/QueryBus')

    return await bus.execute(command)
  }

  protected async getService(service: keyof ContainerBindings) {
    return await app.container.make(service)
  }

  protected parseQuerySearch(query: Record<string, any>) {
    return new QuerySearch(query.q || query.search)
  }

  protected parseQueryPagination(query: Record<string, any>) {
    const page = query.page || query['page[offset]']
    const limit = query.limit || query['page[limit]']

    return new Pagination(page, limit)
  }

  protected parseQuerySort(query: Record<string, any>) {
    const entries = Object.entries(query).reduce(
      (acc, [key, value]) => {
        if (key.startsWith('sort[') && key.endsWith(']')) {
          const param = _.split(key, '[')[1].replace(']', '')
          acc.push(param === 'desc' ? { [value]: 'desc' } : { [value]: 'asc' })
        }
        return acc
      },
      [] as Record<string, any>[]
    )

    const uniqOrder = entries.at(0)

    return uniqOrder
      ? new Sort(Object.keys(uniqOrder).at(0) || '', Object.values(uniqOrder).at(0))
      : new Sort('', 'asc')
  }
}
