import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { GetProductCategoryQuery } from '../queries/get_product_category_query'
import { ProductCategoryDetailsDto } from '../dto/product_category_read_dto'
import { ProductCategoryReadModel } from '../services/product_category_read_repository'
import { ProductCategoryNotFoundError } from '../errors/product_category_not_found_error'

export class GetProductCategoryHandler implements QueryHandler<
  GetProductCategoryQuery,
  ProductCategoryDetailsDto
> {
  constructor(private readonly repository: ProductCategoryReadModel) {}

  async handle(query: GetProductCategoryQuery): Promise<ProductCategoryDetailsDto> {
    const category = await this.repository.getById(query.categoryId)

    if (!category) {
      throw new ProductCategoryNotFoundError(query.categoryId)
    }

    return category
  }
}
