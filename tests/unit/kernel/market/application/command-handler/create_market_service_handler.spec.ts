import { test } from '@japa/runner'
import { CreateMarketServiceHandler } from '#kernel/market/application/command_handler/create_market_service_handler'
import { CreateMarketServiceCommand } from '#kernel/market/application/command/create_market_service_command'
import { MarketServiceRepository } from '#kernel/market/domain/repository/market_service_repository'
import { ImageMediaRepository } from '#kernel/medias/domain/image_media_repository'
import { MarketService } from '#kernel/market/domain/entity/market_service'
import { ImageMedia } from '#kernel/medias/domain/image_media'
import { AppId } from '#shared/domain/app_id'
import { ImageNotFoundError } from '#kernel/medias/domain/errors/image_not_found_error'

test.group('CreateMarketServiceHandler', () => {
  const IMG_123 = '00000000-0000-4000-8000-000000000123'
  const NON_EXISTENT = '00000000-0000-4000-8000-00000000ffff'

  const createMockImage = (): ImageMedia => {
    return new ImageMedia(
      AppId.fromString(IMG_123),
      'Test Image',
      'https://example.com/image.jpg',
      'Alt text',
      {},
      new Date(),
      null,
      'images/test-image.jpg'
    )
  }

  const createMockRepository = (): MarketServiceRepository => ({
    save: async () => {},
    getById: async () => {
      throw new Error('Not implemented')
    },
    delete: async () => {
      throw new Error('Not implemented')
    },
  })

  const createMockImageRepository = (image: ImageMedia | null = createMockImage()): ImageMediaRepository => ({
    save: async () => {},
    findById: async () => image,
    findByUrl: async () => null,
    delete: async () => {},
  })

  test('should create market service with valid command data', async ({ assert }) => {
    let savedService: MarketService | null = null

    const mockRepository: MarketServiceRepository = {
      ...createMockRepository(),
      save: async (service: MarketService) => {
        savedService = service
      },
    }

    const handler = new CreateMarketServiceHandler(mockRepository, createMockImageRepository())
    const command = new CreateMarketServiceCommand(
      'Solar Installation',
      AppId.fromString(IMG_123),
      '<p>Content description</p>',
      'Short description',
      ['Feature 1', 'Feature 2']
    )

    await handler.handle(command)

    assert.isDefined(savedService)
    assert.equal(savedService!.getDesignation(), 'Solar Installation')
    assert.equal(savedService!.getShortDescription(), 'Short description')
  })

  test('should throw ImageNotFoundError when thumbnail not found', async ({ assert }) => {
    const mockImageRepository = createMockImageRepository(null)

    const handler = new CreateMarketServiceHandler(createMockRepository(), mockImageRepository)
    const command = new CreateMarketServiceCommand(
      'Solar Installation',
      AppId.fromString(NON_EXISTENT),
      '<p>Content</p>',
      'Short desc'
    )

    try {
      await handler.handle(command)
      assert.fail('Should have thrown an error')
    } catch (error) {
      assert.instanceOf(error, ImageNotFoundError)
    }
  })

  test('should call imageRepository.findById with correct id', async ({ assert }) => {
    let capturedId: string | null = null

    const mockImageRepository: ImageMediaRepository = {
      ...createMockImageRepository(),
      findById: async (id: string) => {
        capturedId = id
        return createMockImage()
      },
    }

    const handler = new CreateMarketServiceHandler(createMockRepository(), mockImageRepository)
    const command = new CreateMarketServiceCommand(
      'Solar Installation',
      AppId.fromString(IMG_123),
      '<p>Content</p>',
      'Short desc'
    )

    await handler.handle(command)

    assert.equal(capturedId, IMG_123)
  })

  test('should save market service with thumbnail', async ({ assert }) => {
    let savedService: MarketService | null = null

    const mockRepository: MarketServiceRepository = {
      ...createMockRepository(),
      save: async (service: MarketService) => {
        savedService = service
      },
    }

    const handler = new CreateMarketServiceHandler(mockRepository, createMockImageRepository())
    const command = new CreateMarketServiceCommand(
      'Solar Installation',
      AppId.fromString(IMG_123),
      '<p>Content</p>',
      'Short desc'
    )

    await handler.handle(command)

    assert.isDefined(savedService)
    assert.isDefined(savedService!.getThumbnail())
    assert.equal(savedService!.getThumbnail()!.getId(), IMG_123)
  })

  test('should handle optional contentDescription', async ({ assert }) => {
    let savedService: MarketService | null = null

    const mockRepository: MarketServiceRepository = {
      ...createMockRepository(),
      save: async (service: MarketService) => {
        savedService = service
      },
    }

    const handler = new CreateMarketServiceHandler(mockRepository, createMockImageRepository())
    const command = new CreateMarketServiceCommand(
      'Solar Installation',
      AppId.fromString(IMG_123),
      undefined,
      'Short desc'
    )

    await handler.handle(command)

    assert.isDefined(savedService)
  })
})
