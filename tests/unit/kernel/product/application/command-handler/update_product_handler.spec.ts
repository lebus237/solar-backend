import { test } from '@japa/runner'
import { UpdateProductHandler } from '#kernel/product/application/command-handler/update_product_handler'
import { UpdateProductCommand } from '#kernel/product/application/command/update_product_command'
import { ProductRepository } from '#kernel/product/domain/repository/product_repository'
import { Product } from '#kernel/product/domain/entity/product'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'
import { ProductImage } from '#kernel/product/domain/entity/product_image'
import { asProductId, asProductCategoryId } from '#shared/domain/types/branded_types'

test.group('UpdateProductHandler', () => {
  const createExistingProduct = () => {
    const category = new ProductCategory(asProductCategoryId('old-cat'), 'Old Category')
    const mainImage = new ProductImage('old-main-img', 'https://example.com/old.jpg')
    const images = [new ProductImage('img-2'), new ProductImage('img-3')]

    return new Product(
      asProductId('prod-1'),
      'Old Designation',
      category,
      'Old Description',
      100,
      mainImage,
      images,
      'old-slug-123',
      'OldBrand',
      50,
      10,
      true,
      false,
      new Date('2024-01-01'),
      new Date('2024-01-15')
    )
  }

  test('should fetch existing product from repository', async ({ assert }) => {
    let findCalled = false
    const existingProduct = createExistingProduct()

    const mockRepository: ProductRepository = {
      save: async () => {},
      find: async (id) => {
        findCalled = true
        assert.equal(id, 'prod-1')
        return existingProduct
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new UpdateProductHandler(mockRepository)
    const command = new UpdateProductCommand(
      'prod-1',
      'New Designation',
      'new-cat',
      'New Description',
      200,
      'NewBrand'
    )

    await handler.handle(command)

    assert.isTrue(findCalled)
  })

  test('should update designation, description, price, brand, category', async ({ assert }) => {
    let savedProduct: Product | null = null
    const existingProduct = createExistingProduct()

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        savedProduct = product
      },
      find: async () => existingProduct,
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new UpdateProductHandler(mockRepository)
    const command = new UpdateProductCommand(
      'prod-1',
      'Updated Product',
      'new-cat-456',
      'Updated Description',
      299.99,
      'UpdatedBrand'
    )

    await handler.handle(command)

    assert.equal(savedProduct!.getDesignation(), 'Updated Product')
    assert.equal(savedProduct!.getDescription(), 'Updated Description')
    assert.equal(savedProduct!.getPrice(), 299.99)
    assert.equal(savedProduct!.getBrand(), 'UpdatedBrand')
    assert.equal(savedProduct!.getCategory().getId(), 'new-cat-456')
  })

  test('should preserve existing images', async ({ assert }) => {
    let savedProduct: Product | null = null
    const existingProduct = createExistingProduct()
    const originalImages = existingProduct.getImages()

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        savedProduct = product
      },
      find: async () => existingProduct,
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new UpdateProductHandler(mockRepository)
    const command = new UpdateProductCommand('prod-1', 'Updated', 'cat-1', 'Desc', 100)

    await handler.handle(command)

    assert.deepEqual(savedProduct!.getImages(), originalImages)
  })

  test('should preserve existing slug', async ({ assert }) => {
    let savedProduct: Product | null = null
    const existingProduct = createExistingProduct()

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        savedProduct = product
      },
      find: async () => existingProduct,
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new UpdateProductHandler(mockRepository)
    const command = new UpdateProductCommand('prod-1', 'Updated', 'cat-1', 'Desc', 100)

    await handler.handle(command)

    assert.equal(savedProduct!.getSlug(), 'old-slug-123')
  })

  test('should preserve stock data', async ({ assert }) => {
    let savedProduct: Product | null = null
    const existingProduct = createExistingProduct()

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        savedProduct = product
      },
      find: async () => existingProduct,
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new UpdateProductHandler(mockRepository)
    const command = new UpdateProductCommand('prod-1', 'Updated', 'cat-1', 'Desc', 100)

    await handler.handle(command)

    assert.equal(savedProduct!.getStockQuantity(), 50)
    assert.equal(savedProduct!.getLowStockThreshold(), 10)
  })

  test('should preserve availability flags', async ({ assert }) => {
    let savedProduct: Product | null = null
    const existingProduct = createExistingProduct()

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        savedProduct = product
      },
      find: async () => existingProduct,
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new UpdateProductHandler(mockRepository)
    const command = new UpdateProductCommand('prod-1', 'Updated', 'cat-1', 'Desc', 100)

    await handler.handle(command)

    assert.equal(savedProduct!.getIsAvailable(), true)
    assert.equal(savedProduct!.getIsDeleted(), false)
  })

  test('should preserve main image', async ({ assert }) => {
    let savedProduct: Product | null = null
    const existingProduct = createExistingProduct()

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        savedProduct = product
      },
      find: async () => existingProduct,
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new UpdateProductHandler(mockRepository)
    const command = new UpdateProductCommand('prod-1', 'Updated', 'cat-1', 'Desc', 100)

    await handler.handle(command)

    assert.equal(savedProduct!.getMainImage().id, 'old-main-img')
  })

  test('should preserve product id', async ({ assert }) => {
    let savedProduct: Product | null = null
    const existingProduct = createExistingProduct()

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        savedProduct = product
      },
      find: async () => existingProduct,
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new UpdateProductHandler(mockRepository)
    const command = new UpdateProductCommand('prod-1', 'Updated', 'cat-1', 'Desc', 100)

    await handler.handle(command)

    assert.equal(savedProduct!.getId(), 'prod-1')
  })
})
