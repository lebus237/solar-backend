import { test } from '@japa/runner'
import { CreateProductHandler } from '#kernel/product/application/command-handler/create_product_handler'
import { CreateProductCommand } from '#kernel/product/application/command/create_product_command'
import { ProductRepository } from '#kernel/product/domain/repository/product_repository'
import { Product } from '#kernel/product/domain/entity/product'

test.group('CreateProductHandler', () => {
  const IMG_1 = '00000000-0000-4000-8000-000000000001'
  const IMG_2 = '00000000-0000-4000-8000-000000000002'
  const IMG_3 = '00000000-0000-4000-8000-000000000003'
  const MAIN_IMG_123 = '00000000-0000-4000-8000-000000000123'
  const CAT_1 = '00000000-0000-4000-8000-0000000000c1'
  const CAT_456 = '00000000-0000-4000-8000-000000000456'

  test('should create product with valid command data', async ({ assert }) => {
    let savedProduct: Product | null = null

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        savedProduct = product
      },
      find: async () => {
        throw new Error('Not implemented')
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductHandler(mockRepository)
    const command = new CreateProductCommand(
      '300W Solar Panel',
      IMG_1,
      CAT_1,
      'High efficiency solar panel',
      299.99,
      'SunPower',
      [IMG_2, IMG_3]
    )

    await handler.handle(command)

    assert.isDefined(savedProduct)
    assert.equal(savedProduct!.getDesignation(), '300W Solar Panel')
    assert.equal(savedProduct!.getDescription(), 'High efficiency solar panel')
    assert.equal(savedProduct!.getPrice(), 299.99)
    assert.equal(savedProduct!.getBrand(), 'SunPower')
  })

  test('should call repository.save with correct product entity', async ({ assert }) => {
    let saveCalled = false
    let savedProduct: Product | null = null

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        saveCalled = true
        savedProduct = product
      },
      find: async () => {
        throw new Error('Not implemented')
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductHandler(mockRepository)
    const command = new CreateProductCommand('Test Product', IMG_1, CAT_1, 'Description', 100)

    await handler.handle(command)

    assert.isTrue(saveCalled)
    assert.isDefined(savedProduct)
  })

  test('should map imageIds to ProductImage instances', async ({ assert }) => {
    let savedProduct: Product | null = null

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        savedProduct = product
      },
      find: async () => {
        throw new Error('Not implemented')
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductHandler(mockRepository)
    const command = new CreateProductCommand('Test', IMG_1, CAT_1, 'Desc', 100, undefined, [
      IMG_2,
      IMG_3,
    ])

    await handler.handle(command)

    const images = savedProduct!.getImages()
    assert.lengthOf(images, 2)
    assert.equal(images[0].id.value, IMG_2)
    assert.equal(images[1].id.value, IMG_3)
  })

  test('should set mainImage from mainImageId', async ({ assert }) => {
    let savedProduct: Product | null = null

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        savedProduct = product
      },
      find: async () => {
        throw new Error('Not implemented')
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductHandler(mockRepository)
    const command = new CreateProductCommand('Test', MAIN_IMG_123, CAT_1, 'Desc', 100)

    await handler.handle(command)

    assert.equal(savedProduct!.getMainImage().id.value, MAIN_IMG_123)
  })

  test('should set category from categoryId', async ({ assert }) => {
    let savedProduct: Product | null = null

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        savedProduct = product
      },
      find: async () => {
        throw new Error('Not implemented')
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductHandler(mockRepository)
    const command = new CreateProductCommand('Test', IMG_1, CAT_456, 'Desc', 100)

    await handler.handle(command)

    assert.equal(savedProduct!.getCategory().getId()!.value, CAT_456)
  })

  test('should handle empty imageIds array', async ({ assert }) => {
    let savedProduct: Product | null = null

    const mockRepository: ProductRepository = {
      save: async (product: Product) => {
        savedProduct = product
      },
      find: async () => {
        throw new Error('Not implemented')
      },
      delete: async () => {
        throw new Error('Not implemented')
      },
    }

    const handler = new CreateProductHandler(mockRepository)
    const command = new CreateProductCommand('Test', IMG_1, CAT_1, 'Desc', 100, undefined, [])

    await handler.handle(command)

    assert.deepEqual(savedProduct!.getImages(), [])
  })
})
