import { test } from '@japa/runner'
import { Product } from '#kernel/product/domain/entity/product'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'
import { ProductImage } from '#kernel/product/domain/entity/product_image'
import { AppId } from '#shared/domain/app_id'

const asProductId = (value: string) => AppId.fromString(value)
const asProductCategoryId = (value: string) => AppId.fromString(value)

test.group('Product Entity', (group) => {
  let category: ProductCategory
  let mainImage: ProductImage

  group.setup(() => {
    category = new ProductCategory(
      asProductCategoryId('00000000-0000-4000-8000-0000000000c1'),
      'Solar Panels'
    )
    mainImage = new ProductImage(
      AppId.fromString('00000000-0000-4000-8000-000000000001'),
      'https://example.com/image.jpg'
    )
  })

  // ============================================
  // Constructor & Defaults
  // ============================================

  test('should create product with all required properties', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      '300W Solar Panel',
      category,
      'High efficiency solar panel',
      299.99,
      mainImage
    )

    assert.equal(product.getId()!.value, '00000000-0000-4000-8000-0000000000b1')
    assert.equal(product.getDesignation(), '300W Solar Panel')
    assert.equal(product.getDescription(), 'High efficiency solar panel')
    assert.equal(product.getPrice(), 299.99)
    assert.deepEqual(product.getCategory(), category)
    assert.deepEqual(product.getMainImage(), mainImage)
  })

  test('should auto-generate slug if not provided', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      '300W Solar Panel',
      category,
      'High efficiency solar panel',
      299.99,
      mainImage
    )

    const slug = product.getSlug()
    assert.isDefined(slug)
    assert.isTrue(slug!.startsWith('300w-solar-panel-'))
    assert.isBelow(slug!.length, 50)
  })

  test('should use provided slug when specified', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      '300W Solar Panel',
      category,
      'High efficiency solar panel',
      299.99,
      mainImage,
      [],
      'custom-slug-123'
    )

    assert.equal(product.getSlug(), 'custom-slug-123')
  })

  test('should default isAvailable to false', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      '300W Solar Panel',
      category,
      'High efficiency solar panel',
      299.99,
      mainImage
    )

    assert.isFalse(product.getIsAvailable()!)
  })

  test('should default isDeleted to false', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      '300W Solar Panel',
      category,
      'High efficiency solar panel',
      299.99,
      mainImage
    )

    assert.isFalse(product.getIsDeleted()!)
  })

  test('should default stockQuantity to 0', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      '300W Solar Panel',
      category,
      'High efficiency solar panel',
      299.99,
      mainImage
    )

    assert.equal(product.getStockQuantity(), 0)
  })

  test('should default lowStockThreshold to 10', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      '300W Solar Panel',
      category,
      'High efficiency solar panel',
      299.99,
      mainImage
    )

    assert.equal(product.getLowStockThreshold(), 10)
  })

  test('should accept custom stockQuantity and lowStockThreshold', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      '300W Solar Panel',
      category,
      'High efficiency solar panel',
      299.99,
      mainImage,
      [],
      undefined,
      undefined,
      50,
      15
    )

    assert.equal(product.getStockQuantity(), 50)
    assert.equal(product.getLowStockThreshold(), 15)
  })

  test('should accept images array', ({ assert }) => {
    const image1 = new ProductImage(AppId.fromString('00000000-0000-4000-8000-000000000002'))
    const image2 = new ProductImage(AppId.fromString('00000000-0000-4000-8000-000000000003'))

    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      '300W Solar Panel',
      category,
      'High efficiency solar panel',
      299.99,
      mainImage,
      [image1, image2]
    )

    assert.deepEqual(product.getImages(), [image1, image2])
  })

  test('should accept brand', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      '300W Solar Panel',
      category,
      'High efficiency solar panel',
      299.99,
      mainImage,
      [],
      undefined,
      'SunPower'
    )

    assert.equal(product.getBrand(), 'SunPower')
  })

  // ============================================
  // Getters
  // ============================================

  test('should return id via getId', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b2'),
      'Test',
      category,
      'Desc',
      100,
      mainImage
    )
    assert.equal(product.getId()!.value, '00000000-0000-4000-8000-0000000000b2')
  })

  test('should return designation via getDesignation', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      'Test Product',
      category,
      'Desc',
      100,
      mainImage
    )
    assert.equal(product.getDesignation(), 'Test Product')
  })

  test('should return category via getCategory', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      'Test',
      category,
      'Desc',
      100,
      mainImage
    )
    assert.deepEqual(product.getCategory(), category)
  })

  test('should return description via getDescription', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      'Test',
      category,
      'Test Description',
      100,
      mainImage
    )
    assert.equal(product.getDescription(), 'Test Description')
  })

  test('should return price via getPrice', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      'Test',
      category,
      'Desc',
      599.99,
      mainImage
    )
    assert.equal(product.getPrice(), 599.99)
  })

  test('should return mainImage via getMainImage', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      'Test',
      category,
      'Desc',
      100,
      mainImage
    )
    assert.deepEqual(product.getMainImage(), mainImage)
  })

  test('should return images via getImages', ({ assert }) => {
    const images = [
      new ProductImage(AppId.fromString('00000000-0000-4000-8000-000000000002')),
      new ProductImage(AppId.fromString('00000000-0000-4000-8000-000000000003')),
    ]
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      'Test',
      category,
      'Desc',
      100,
      mainImage,
      images
    )
    assert.deepEqual(product.getImages(), images)
  })

  test('should return createdAt via getCreatedAt', ({ assert }) => {
    const date = new Date('2024-01-15')
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      'Test',
      category,
      'Desc',
      100,
      mainImage,
      [],
      undefined,
      undefined,
      0,
      10,
      false,
      false,
      date
    )
    assert.deepEqual(product.getCreatedAt(), date)
  })

  test('should return updatedAt via getUpdatedAt', ({ assert }) => {
    const date = new Date('2024-01-20')
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      'Test',
      category,
      'Desc',
      100,
      mainImage,
      [],
      undefined,
      undefined,
      0,
      10,
      false,
      false,
      undefined,
      date
    )
    assert.deepEqual(product.getUpdatedAt(), date)
  })

  // ============================================
  // Stock Logic
  // ============================================

  test('isLowStock returns true when stock > 0 and <= threshold', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      'Test',
      category,
      'Desc',
      100,
      mainImage,
      [],
      undefined,
      undefined,
      5, // stockQuantity
      10 // lowStockThreshold
    )

    assert.isTrue(product.isLowStock())
  })

  test('isLowStock returns true when stock equals threshold', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      'Test',
      category,
      'Desc',
      100,
      mainImage,
      [],
      undefined,
      undefined,
      10, // stockQuantity equals threshold
      10
    )

    assert.isTrue(product.isLowStock())
  })

  test('isLowStock returns false when stock = 0', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      'Test',
      category,
      'Desc',
      100,
      mainImage,
      [],
      undefined,
      undefined,
      0,
      10
    )

    assert.isFalse(product.isLowStock())
  })

  test('isLowStock returns false when stock > threshold', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      'Test',
      category,
      'Desc',
      100,
      mainImage,
      [],
      undefined,
      undefined,
      20, // stockQuantity > threshold
      10
    )

    assert.isFalse(product.isLowStock())
  })

  test('isOutOfStock returns true when stock <= 0', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      'Test',
      category,
      'Desc',
      100,
      mainImage,
      [],
      undefined,
      undefined,
      0,
      10
    )

    assert.isTrue(product.isOutOfStock())
  })

  test('isOutOfStock returns true when stock is negative', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      'Test',
      category,
      'Desc',
      100,
      mainImage,
      [],
      undefined,
      undefined,
      -5,
      10
    )

    assert.isTrue(product.isOutOfStock())
  })

  test('isOutOfStock returns false when stock > 0', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      'Test',
      category,
      'Desc',
      100,
      mainImage,
      [],
      undefined,
      undefined,
      1,
      10
    )

    assert.isFalse(product.isOutOfStock())
  })

  // ============================================
  // Setters
  // ============================================

  test('setStockQuantity updates stock quantity', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      'Test',
      category,
      'Desc',
      100,
      mainImage,
      [],
      undefined,
      undefined,
      0,
      10
    )

    product.setStockQuantity(50)

    assert.equal(product.getStockQuantity(), 50)
  })

  test('setLowStockThreshold updates threshold', ({ assert }) => {
    const product = new Product(
      asProductId('00000000-0000-4000-8000-0000000000b1'),
      'Test',
      category,
      'Desc',
      100,
      mainImage,
      [],
      undefined,
      undefined,
      0,
      10
    )

    product.setLowStockThreshold(20)

    assert.equal(product.getLowStockThreshold(), 20)
  })
})
