import { DomainError } from '#shared/domain/errors/domain_error'

export class ProductPackNotFoundError extends DomainError {
  constructor(
    public readonly packId: string,
    cause?: Error
  ) {
    super('PRODUCT_PACK_NOT_FOUND', `Product pack with id "${packId}" not found`, { packId }, cause)
  }
}
