import { test } from '@japa/runner'
import { UpdateMarketServiceHandler } from '#kernel/market/application/command_handler/update_market_service_handler'
import { UpdateMarketServiceCommand } from '#kernel/market/application/command/update_market_service_command'
import { MarketServiceRepository } from '#kernel/market/domain/repository/market_service_repository'
import { MarketService } from '#kernel/market/domain/entity/market_service'
import { ImageMedia } from '#kernel/medias/domain/image_media'
import { AppId } from '#shared/domain/app_id'

test.group('UpdateMarketServiceHandler', () => {
  const SERVICE_ID = '00000000-0000-4000-8000-000000000001'
  const IMG_123 = '00000000-0000-4000-8000-000000000123'

  const createMockThumbnail = (): ImageMedia => {
    return new ImageMedia(
      AppId.fromString(IMG_123),
      'Test Thumbnail',
      'https://example.com/thumbnail.jpg',
      'Alt text',
      {},
      new Date(),
      null,
      'images/thumbnail.jpg'
    )
  }

  const createExistingMarketService = (): MarketService => {
    return new MarketService(
      AppId.fromString(SERVICE_ID),
      'Original Service',
      createMockThumbnail(),
      '<p>Original content</p>',
      'Original short description',
      ['Feature 1'],
      [],
      new Date(),
      new Date()
    )
  }

  const createMockRepository = (
    service: MarketService = createExistingMarketService()
  ): MarketServiceRepository => ({
    save: async () => {},
    getById: async () => service,
    delete: async () => {},
  })

  test('should update market service designation', async ({ assert }) => {
    let savedService: MarketService | null = null

    const mockRepository: MarketServiceRepository = {
      ...createMockRepository(),
      save: async (service: MarketService) => {
        savedService = service
      },
    }

    const handler = new UpdateMarketServiceHandler(mockRepository)
    const command = new UpdateMarketServiceCommand(
      AppId.fromString(SERVICE_ID),
      'Updated Service Name',
      '<p>New content</p>',
      'Updated short description',
      ['Feature 1', 'Feature 2']
    )

    await handler.handle(command)

    assert.equal(savedService!.getDesignation(), 'Updated Service Name')
  })

  test('should preserve existing thumbnail', async ({ assert }) => {
    let savedService: MarketService | null = null

    const mockRepository: MarketServiceRepository = {
      ...createMockRepository(),
      save: async (service: MarketService) => {
        savedService = service
      },
    }

    const handler = new UpdateMarketServiceHandler(mockRepository)
    const command = new UpdateMarketServiceCommand(
      AppId.fromString(SERVICE_ID),
      'Updated Service',
      '<p>New content</p>',
      'Updated short desc'
    )

    await handler.handle(command)

    assert.isDefined(savedService!.getThumbnail())
    assert.equal(savedService!.getThumbnail()!.getId(), IMG_123)
  })

  test('should update contentDescription when provided', async ({ assert }) => {
    let savedService: MarketService | null = null

    const mockRepository: MarketServiceRepository = {
      ...createMockRepository(),
      save: async (service: MarketService) => {
        savedService = service
      },
    }

    const handler = new UpdateMarketServiceHandler(mockRepository)
    const command = new UpdateMarketServiceCommand(
      AppId.fromString(SERVICE_ID),
      'Updated Service',
      '<p>New content description</p>',
      'Updated short desc'
    )

    await handler.handle(command)

    assert.equal(savedService!.getContent(), '<p>New content description</p>')
  })

  test('should preserve existing contentDescription when not provided', async ({ assert }) => {
    let savedService: MarketService | null = null

    const mockRepository: MarketServiceRepository = {
      ...createMockRepository(),
      save: async (service: MarketService) => {
        savedService = service
      },
    }

    const handler = new UpdateMarketServiceHandler(mockRepository)
    const command = new UpdateMarketServiceCommand(
      AppId.fromString(SERVICE_ID),
      'Updated Service',
      undefined,
      'Updated short desc'
    )

    await handler.handle(command)

    assert.equal(savedService!.getContent(), '<p>Original content</p>')
  })

  test('should call repository.getById with correct service id', async ({ assert }) => {
    let capturedId: AppId | null = null

    const mockRepository: MarketServiceRepository = {
      ...createMockRepository(),
      getById: async (id: AppId) => {
        capturedId = id
        return createExistingMarketService()
      },
    }

    const handler = new UpdateMarketServiceHandler(mockRepository)
    const command = new UpdateMarketServiceCommand(
      AppId.fromString(SERVICE_ID),
      'Updated Service',
      '<p>Content</p>',
      'Short desc'
    )

    await handler.handle(command)

    assert.equal(capturedId!.value, SERVICE_ID)
  })

  test('should update features when provided', async ({ assert }) => {
    let savedService: MarketService | null = null

    const mockRepository: MarketServiceRepository = {
      ...createMockRepository(),
      save: async (service: MarketService) => {
        savedService = service
      },
    }

    const handler = new UpdateMarketServiceHandler(mockRepository)
    const command = new UpdateMarketServiceCommand(
      AppId.fromString(SERVICE_ID),
      'Updated Service',
      '<p>Content</p>',
      'Short desc',
      ['Feature A', 'Feature B', 'Feature C']
    )

    await handler.handle(command)

    assert.deepEqual(savedService!.getFeatures(), ['Feature A', 'Feature B', 'Feature C'])
  })
})
