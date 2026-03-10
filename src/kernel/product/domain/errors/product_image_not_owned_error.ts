import { DomainError } from '#shared/domain/errors/domain_error'

export class ProductImageNotOwnedError extends DomainError {
  constructor(productId: string, imageId: string) {
    super('PRODUCT_IMAGE_NOT_OWNED', 'Image not found or does not belong to this product', {
      productId,
      imageId,
    })
  }
}
