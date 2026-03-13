import { test } from '@japa/runner'
import { ProductImage } from '#kernel/product/domain/entity/product_image'
import { AppId } from '#shared/domain/app_id'

test.group('ProductImage Entity', () => {
  // ============================================
  // Constructor
  // ============================================

  test('should create image with id only', ({ assert }) => {
    const image = new ProductImage(AppId.fromString('00000000-0000-4000-8000-000000000001'))

    assert.equal(image.id.value, '00000000-0000-4000-8000-000000000001')
    assert.isNull(image.url)
    assert.isNull(image.alt)
    assert.isNull(image.title)
  })

  test('should create image with all properties', ({ assert }) => {
    const image = new ProductImage(
      AppId.fromString('00000000-0000-4000-8000-000000000001'),
      'https://example.com/image.jpg',
      'Solar panel image',
      'Product Photo'
    )

    assert.equal(image.id.value, '00000000-0000-4000-8000-000000000001')
    assert.equal(image.url, 'https://example.com/image.jpg')
    assert.equal(image.alt, 'Solar panel image')
    assert.equal(image.title, 'Product Photo')
  })

  test('should default url to null', ({ assert }) => {
    const image = new ProductImage(AppId.fromString('00000000-0000-4000-8000-000000000001'))

    assert.isNull(image.url)
  })

  test('should default alt to null', ({ assert }) => {
    const image = new ProductImage(AppId.fromString('00000000-0000-4000-8000-000000000001'))

    assert.isNull(image.alt)
  })

  test('should default title to null', ({ assert }) => {
    const image = new ProductImage(AppId.fromString('00000000-0000-4000-8000-000000000001'))

    assert.isNull(image.title)
  })

  test('should accept partial properties', ({ assert }) => {
    const imageWithUrl = new ProductImage(
      AppId.fromString('00000000-0000-4000-8000-000000000001'),
      'https://example.com/image.jpg'
    )
    const imageWithAlt = new ProductImage(
      AppId.fromString('00000000-0000-4000-8000-000000000001'),
      null,
      'Alt text'
    )

    assert.equal(imageWithUrl.url, 'https://example.com/image.jpg')
    assert.isNull(imageWithUrl.alt)
    assert.isNull(imageWithAlt.url)
    assert.equal(imageWithAlt.alt, 'Alt text')
  })

  test('properties should be public and accessible', ({ assert }) => {
    const image = new ProductImage(
      AppId.fromString('00000000-0000-4000-8000-000000000001'),
      'https://example.com/image.jpg',
      'Alt',
      'Title'
    )

    // Direct property access (public)
    assert.equal(image.id.value, '00000000-0000-4000-8000-000000000001')
    assert.equal(image.url, 'https://example.com/image.jpg')
    assert.equal(image.alt, 'Alt')
    assert.equal(image.title, 'Title')
  })
})
