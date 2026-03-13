import { test } from '@japa/runner'
import { ProductImageLimitReachedError } from '#kernel/product/domain/errors/product_image_limit_reached_error'
import { DomainError } from '#shared/domain/errors/domain_error'

test.group('ProductImageLimitReachedError', () => {
  const PROD_1 = '00000000-0000-4000-8000-0000000000b1'
  const PROD_123 = '00000000-0000-4000-8000-0000000000b2'

  test('should extend DomainError', ({ assert }) => {
    const error = new ProductImageLimitReachedError(PROD_1, 3)

    assert.instanceOf(error, DomainError)
    assert.instanceOf(error, Error)
  })

  test('should have code PRODUCT_IMAGE_LIMIT_REACHED', ({ assert }) => {
    const error = new ProductImageLimitReachedError(PROD_1, 3)

    assert.equal(error.code, 'PRODUCT_IMAGE_LIMIT_REACHED')
  })

  test('should include productId in details', ({ assert }) => {
    const error = new ProductImageLimitReachedError(PROD_123, 3)

    assert.equal(error.details?.productId, PROD_123)
  })

  test('should include maxImages in details', ({ assert }) => {
    const error = new ProductImageLimitReachedError(PROD_1, 5)

    assert.equal(error.details?.maxImages, 5)
  })

  test('should have descriptive message', ({ assert }) => {
    const error = new ProductImageLimitReachedError(PROD_1, 3)

    assert.equal(error.message, 'Cannot add more images to this product')
  })

  test('should have correct name', ({ assert }) => {
    const error = new ProductImageLimitReachedError(PROD_1, 3)

    assert.equal(error.name, 'ProductImageLimitReachedError')
  })
})
