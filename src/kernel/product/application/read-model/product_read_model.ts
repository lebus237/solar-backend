import { ProductDetailsDto } from '#kernel/product/application/dto/product_read_dto'

export interface ProductReadModel {
  getById(productId: string): Promise<ProductDetailsDto | null>
  getBySlug(slug: string): Promise<ProductDetailsDto | null>
}
