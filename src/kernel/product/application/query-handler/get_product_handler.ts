import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { GetProductQuery } from '../queries/get_product_query'
import { ProductDetailsDto } from '../dto/product_read_dto'
import { ProductReadModel } from '../services/product_read_repository'
import { ProductNotFoundError } from '../errors/product_not_found_error'

export class GetProductHandler implements QueryHandler<GetProductQuery, ProductDetailsDto> {
  constructor(private readonly productReadRepository: ProductReadModel) {}

  async handle(query: GetProductQuery): Promise<ProductDetailsDto> {
    const product = await this.productReadRepository.getById(query.productId)

    if (!product) {
      throw new ProductNotFoundError(query.productId)
    }

    return product
  }
}
