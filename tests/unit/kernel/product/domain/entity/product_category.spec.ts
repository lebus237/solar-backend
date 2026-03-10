import { test } from '@japa/runner'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'
import { asProductCategoryId } from '#shared/domain/types/branded_types'

test.group('ProductCategory Entity', () => {
  // ============================================
  // Constructor & Defaults
  // ============================================

  test('should create category with all properties', ({ assert }) => {
    const category = new ProductCategory(
      asProductCategoryId('cat-1'),
      'Solar Panels',
      'CATEGORY',
      null,
      'solar-panels-slug'
    )

    assert.equal(category.getId(), 'cat-1')
    assert.equal(category.getDesignation(), 'Solar Panels')
    assert.equal(category.getType(), 'CATEGORY')
    assert.equal(category.getParentId(), null)
    assert.equal(category.getSlug(), 'solar-panels-slug')
  })

  test('should auto-generate slug if not provided', ({ assert }) => {
    const category = new ProductCategory(asProductCategoryId('cat-1'), 'Solar Panels')

    const slug = category.getSlug()
    assert.isDefined(slug)
    assert.isTrue(slug!.startsWith('solar-panels-'))
    assert.isBelow(slug!.length, 50)
  })

  test('should default type to CATEGORY', ({ assert }) => {
    const category = new ProductCategory(asProductCategoryId('cat-1'), 'Solar Panels')

    assert.equal(category.getType(), 'CATEGORY')
  })

  test('should accept TAG as type', ({ assert }) => {
    const category = new ProductCategory(asProductCategoryId('tag-1'), 'Eco-Friendly', 'TAG')

    assert.equal(category.getType(), 'TAG')
  })

  test('should accept parentId for nested categories', ({ assert }) => {
    const parentCategory = new ProductCategory(asProductCategoryId('cat-1'), 'Solar Panels')
    const childCategory = new ProductCategory(
      asProductCategoryId('cat-2'),
      'Monocrystalline Panels',
      'CATEGORY',
      parentCategory.getId()
    )

    assert.equal(childCategory.getParentId(), 'cat-1')
  })

  test('should accept null parentId for root categories', ({ assert }) => {
    const category = new ProductCategory(
      asProductCategoryId('cat-1'),
      'Solar Panels',
      'CATEGORY',
      null
    )

    assert.equal(category.getParentId(), null)
  })

  test('should accept createdAt date', ({ assert }) => {
    const date = new Date('2024-01-15')
    const category = new ProductCategory(
      asProductCategoryId('cat-1'),
      'Solar Panels',
      'CATEGORY',
      null,
      null,
      date
    )

    assert.deepEqual(category.getCreatedAt(), date)
  })

  test('should accept updatedAt date', ({ assert }) => {
    const date = new Date('2024-01-20')
    const category = new ProductCategory(
      asProductCategoryId('cat-1'),
      'Solar Panels',
      'CATEGORY',
      null,
      null,
      undefined,
      date
    )

    assert.deepEqual(category.getUpdatedAt(), date)
  })

  // ============================================
  // Getters
  // ============================================

  test('should return id via getId', ({ assert }) => {
    const category = new ProductCategory(asProductCategoryId('cat-123'), 'Test Category')
    assert.equal(category.getId(), 'cat-123')
  })

  test('should return designation via getDesignation', ({ assert }) => {
    const category = new ProductCategory(asProductCategoryId('cat-1'), 'Test Category')
    assert.equal(category.getDesignation(), 'Test Category')
  })

  test('should return type via getType', ({ assert }) => {
    const categoryCategory = new ProductCategory(asProductCategoryId('cat-1'), 'Test', 'CATEGORY')
    const tagCategory = new ProductCategory(asProductCategoryId('tag-1'), 'Test', 'TAG')

    assert.equal(categoryCategory.getType(), 'CATEGORY')
    assert.equal(tagCategory.getType(), 'TAG')
  })

  test('should return parentId via getParentId', ({ assert }) => {
    const rootCategory = new ProductCategory(asProductCategoryId('cat-1'), 'Root', 'CATEGORY', null)
    const childCategory = new ProductCategory(
      asProductCategoryId('cat-2'),
      'Child',
      'CATEGORY',
      asProductCategoryId('cat-1')
    )

    assert.equal(rootCategory.getParentId(), null)
    assert.equal(childCategory.getParentId(), 'cat-1')
  })

  test('should return slug via getSlug', ({ assert }) => {
    const category = new ProductCategory(asProductCategoryId('cat-1'), 'Test Category')
    const slug = category.getSlug()

    assert.isNotNull(slug)
    assert.isString(slug)
  })
})
