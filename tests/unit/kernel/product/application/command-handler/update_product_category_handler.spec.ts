import { test } from '@japa/runner'
import { UpdateProductCategoryHandler } from '#kernel/product/application/command-handler/update_product_category_handler'
import { UpdateProductCategoryCommand } from '#kernel/product/application/command/update_product_category_command'
import { ProductCategoryRepository } from '#kernel/product/domain/repository/product_category_repository'
import { ProductCategory } from '#kernel/product/domain/entity/product_category'
import { AppId } from '#shared/domain/app_id'

const CAT_1 = '00000000-0000-4000-8000-0000000000c1'
const PARENT_1 = '00000000-0000-4000-8000-0000000000c9'

test.group('UpdateProductCategoryHandler', () => {
  const createExistingCategory = () => {
    return new ProductCategory(
      AppId.fromString(CAT_1),
      'Old Designation',
      'CATEGORY',
      null,
      'old-slug-123',
      new Date('2024-01-01')
    )
  }

  test('should fetch existing category from repository', async ({ assert }) => {
    let findCalled = false
    const existingCategory = createExistingCategory()

    const mockRepository: ProductCategoryRepository = {
      save: async () => {},
      find: async (id) => {
        findCalled = true
        assert.equal(id.value, CAT_1)
        return existingCategory
      },
    }

    const handler = new UpdateProductCategoryHandler(mockRepository)
    const command = new UpdateProductCategoryCommand(CAT_1, 'New Designation', 'CATEGORY', null)

    await handler.handle(command)

    assert.isTrue(findCalled)
  })

  test('should update designation', async ({ assert }) => {
    let savedCategory: ProductCategory | null = null
    const existingCategory = createExistingCategory()

    const mockRepository: ProductCategoryRepository = {
      save: async (category: ProductCategory) => {
        savedCategory = category
      },
      find: async () => existingCategory,
    }

    const handler = new UpdateProductCategoryHandler(mockRepository)
    const command = new UpdateProductCategoryCommand(CAT_1, 'Updated Category', 'CATEGORY', null)

    await handler.handle(command)

    assert.equal(savedCategory!.getDesignation(), 'Updated Category')
  })

  test('should update type', async ({ assert }) => {
    let savedCategory: ProductCategory | null = null
    const existingCategory = createExistingCategory()

    const mockRepository: ProductCategoryRepository = {
      save: async (category: ProductCategory) => {
        savedCategory = category
      },
      find: async () => existingCategory,
    }

    const handler = new UpdateProductCategoryHandler(mockRepository)
    const command = new UpdateProductCategoryCommand(CAT_1, 'Category', 'TAG', null)

    await handler.handle(command)

    assert.equal(savedCategory!.getType(), 'TAG')
  })

  test('should update parentId', async ({ assert }) => {
    let savedCategory: ProductCategory | null = null
    const existingCategory = createExistingCategory()

    const mockRepository: ProductCategoryRepository = {
      save: async (category: ProductCategory) => {
        savedCategory = category
      },
      find: async () => existingCategory,
    }

    const handler = new UpdateProductCategoryHandler(mockRepository)
    const command = new UpdateProductCategoryCommand(CAT_1, 'Category', 'CATEGORY', PARENT_1)

    await handler.handle(command)

    assert.equal(savedCategory!.getParentId()!.value, PARENT_1)
  })

  test('should preserve existing slug', async ({ assert }) => {
    let savedCategory: ProductCategory | null = null
    const existingCategory = createExistingCategory()

    const mockRepository: ProductCategoryRepository = {
      save: async (category: ProductCategory) => {
        savedCategory = category
      },
      find: async () => existingCategory,
    }

    const handler = new UpdateProductCategoryHandler(mockRepository)
    const command = new UpdateProductCategoryCommand(CAT_1, 'Updated', 'CATEGORY', null)

    await handler.handle(command)

    assert.equal(savedCategory!.getSlug(), 'old-slug-123')
  })

  test('should preserve existing createdAt', async ({ assert }) => {
    let savedCategory: ProductCategory | null = null
    const existingCategory = createExistingCategory()

    const mockRepository: ProductCategoryRepository = {
      save: async (category: ProductCategory) => {
        savedCategory = category
      },
      find: async () => existingCategory,
    }

    const handler = new UpdateProductCategoryHandler(mockRepository)
    const command = new UpdateProductCategoryCommand(CAT_1, 'Updated', 'CATEGORY', null)

    await handler.handle(command)

    assert.deepEqual(savedCategory!.getCreatedAt(), new Date('2024-01-01'))
  })

  test('should preserve category id', async ({ assert }) => {
    let savedCategory: ProductCategory | null = null
    const existingCategory = createExistingCategory()

    const mockRepository: ProductCategoryRepository = {
      save: async (category: ProductCategory) => {
        savedCategory = category
      },
      find: async () => existingCategory,
    }

    const handler = new UpdateProductCategoryHandler(mockRepository)
    const command = new UpdateProductCategoryCommand(CAT_1, 'Updated', 'CATEGORY', null)

    await handler.handle(command)

    assert.equal(savedCategory!.getId()!.value, CAT_1)
  })
})
