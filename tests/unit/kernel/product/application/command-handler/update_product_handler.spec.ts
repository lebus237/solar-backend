import { test } from '@japa/runner'
import { UpdateProductHandler } from '#kernel/product/application/command-handler/update_product_handler'
import { UpdateProductCommand } from '#kernel/product/application/command/update_product_command'
import { ProductRepository } from '#kernel/product/domain/repository/product_repository'
import { Product } from '#kernel/product/domain/entity/product'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'
import { ProductImage } from '#kernel/product/domain/entity/product_image'
import { AppId } from '#shared/domain/app_id'

const asProductId = (value: string) => AppId.fromString(value)
const asProductCategoryId = (value: string) => AppId.fromString(value)

const PROD_1 = '00000000-0000-4000-8000-0000000000b1'
const OLD_CAT = '00000000-0000-4000-8000-0000000000c1'
const NEW_CAT = '00000000-0000-4000-8000-0000000000c2'
const NEW_CAT_456 = '00000000-0000-4000-8000-000000000456'
const CAT_1 = '00000000-0000-4000-8000-0000000000c3'
const OLD_MAIN_IMG = '00000000-0000-4000-8000-000000000111'
const IMG_2 = '00000000-0000-4000-8000-000000000002'
const IMG_3 = '00000000-0000-4000-8000-000000000003'

test.group('UpdateProductHandler', () => {
  const createExistingProduct = () => {
    const category = new ProductCategory(asProductCategoryId(OLD_CAT), 'Old Category')
    const mainImage = new ProductImage(
      AppId.fromString(OLD_MAIN_IMG),
      'https://example.com/old.jpg'
    )
    const images = [
      new ProductImage(AppId.fromString(IMG_2)),
      new ProductImage(AppId.fromString(IMG_3)),
    ]

    return new Product(
      asProductId(PROD_1),
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
        assert.equal(id.value, PROD_1)
        return existingProduct
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new UpdateProductHandler(mockRepository)
    const command = new UpdateProductCommand(
      PROD_1,
      'New Designation',
      NEW_CAT,
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
      PROD_1,
      'Updated Product',
      NEW_CAT_456,
      'Updated Description',
      299.99,
      'UpdatedBrand'
    )

    await handler.handle(command)

    assert.equal(savedProduct!.getDesignation(), 'Updated Product')
    assert.equal(savedProduct!.getDescription(), 'Updated Description')
    assert.equal(savedProduct!.getPrice(), 299.99)
    assert.equal(savedProduct!.getBrand(), 'UpdatedBrand')
    assert.equal(savedProduct!.getCategory().getId()!.value, NEW_CAT_456)
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
    const command = new UpdateProductCommand(PROD_1, 'Updated', CAT_1, 'Desc', 100)

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
    const command = new UpdateProductCommand(PROD_1, 'Updated', CAT_1, 'Desc', 100)

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
    const command = new UpdateProductCommand(PROD_1, 'Updated', CAT_1, 'Desc', 100)

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
    const command = new UpdateProductCommand(PROD_1, 'Updated', CAT_1, 'Desc', 100)

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
    const command = new UpdateProductCommand(PROD_1, 'Updated', CAT_1, 'Desc', 100)

    await handler.handle(command)

    assert.equal(savedProduct!.getMainImage().id.value, OLD_MAIN_IMG)
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
    const command = new UpdateProductCommand(PROD_1, 'Updated', CAT_1, 'Desc', 100)

    await handler.handle(command)

    assert.equal(savedProduct!.getId()!.value, PROD_1)
  })
})
