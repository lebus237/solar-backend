import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { MarketServiceDetailsDto } from '#kernel/market/application/dto/market_service_read_dto'
import { MarketServiceReadModel } from '#kernel/market/application/read-model/market_service_read_model'
import { GetMarketServiceQuery } from '#kernel/market/application/query/get_market_service_query'

export class GetMarketServiceHandler implements QueryHandler<
  GetMarketServiceQuery,
  MarketServiceDetailsDto | null
> {
  constructor(private readonly readModel: MarketServiceReadModel) {}

  async handle(query: GetMarketServiceQuery): Promise<MarketServiceDetailsDto | null> {
    return this.readModel.getById(query.marketServiceId)
  }
}
