import { test } from '@japa/runner'
import { ReplaceMarketServiceThumbnailHandler } from '#kernel/market/application/command_handler/replace_market_service_thumbnail_handler'
import { ReplaceMarketServiceThumbnailCommand } from '#kernel/market/application/command/replace_market_service_thumbnail_command'
import { MarketServiceRepository } from '#kernel/market/domain/repository/market_service_repository'
import { ImageMediaRepository } from '#kernel/medias/domain/image_media_repository'
import { MediaManagerInterface } from '#shared/application/services/upload/media_manager_interface'
import { MediaType } from '#shared/application/services/upload/types'
import { MarketService } from '#kernel/market/domain/entity/market_service'
import { ImageMedia } from '#kernel/medias/domain/image_media'
import { AppId } from '#shared/domain/app_id'
import { ImageNotFoundError } from '#kernel/medias/domain/errors/image_not_found_error'

test.group('ReplaceMarketServiceThumbnailHandler', () => {
  const SERVICE_ID = '00000000-0000-4000-8000-000000000001'
  const OLD_THUMBNAIL_ID = '00000000-0000-4000-8000-000000000123'
  const NEW_THUMBNAIL_ID = '00000000-0000-4000-8000-000000000456'
  const NON_EXISTENT = '00000000-0000-4000-8000-00000000ffff'

  const createMockImage = (id: string, key: string): ImageMedia => {
    return new ImageMedia(
      AppId.fromString(id),
      'Test Image',
      'https://example.com/image.jpg',
      'Alt text',
      {},
      new Date(),
      null,
      key
    )
  }

  const createExistingMarketService = (withThumbnail: boolean = true): MarketService => {
    return new MarketService(
      AppId.fromString(SERVICE_ID),
      'Test Service',
      withThumbnail ? createMockImage(OLD_THUMBNAIL_ID, 'images/old-thumbnail.jpg') : null,
      '<p>Content</p>',
      'Short description',
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

  const createMockImageRepository = (
    image: ImageMedia | null = createMockImage(NEW_THUMBNAIL_ID, 'images/new-thumbnail.jpg')
  ): ImageMediaRepository => ({
    save: async () => {},
    findById: async () => image,
    findByUrl: async () => null,
    delete: async () => {},
  })

  const createMockMediaManager = (): MediaManagerInterface => ({
    uploadImage: async () => ({ success: true }),
    uploadFile: async () => ({ success: true }),
    uploadDocument: async () => ({ success: true }),
    deleteFile: async () => true,
    getSignedUrl: async () => '',
    fileExists: async () => true,
    getFileMetadata: async () => ({}),
    getMediaType: () => MediaType.IMAGE,
    setProvider: () => {},
    getProvider: () => ({}) as any,
  })

  test('should replace thumbnail with new one', async ({ assert }) => {
    let savedService: MarketService | null = null

    const mockRepository: MarketServiceRepository = {
      ...createMockRepository(),
      save: async (service: MarketService) => {
        savedService = service
      },
    }

    const handler = new ReplaceMarketServiceThumbnailHandler(
      mockRepository,
      createMockImageRepository(),
      createMockMediaManager()
    )
    const command = new ReplaceMarketServiceThumbnailCommand(
      AppId.fromString(SERVICE_ID),
      AppId.fromString(NEW_THUMBNAIL_ID)
    )

    await handler.handle(command)

    assert.isDefined(savedService!.getThumbnail())
    assert.equal(savedService!.getThumbnail()!.getId(), NEW_THUMBNAIL_ID)
  })

  test('should throw ImageNotFoundError when new thumbnail not found', async ({ assert }) => {
    const mockImageRepository = createMockImageRepository(null)

    const handler = new ReplaceMarketServiceThumbnailHandler(
      createMockRepository(),
      mockImageRepository,
      createMockMediaManager()
    )
    const command = new ReplaceMarketServiceThumbnailCommand(
      AppId.fromString(SERVICE_ID),
      AppId.fromString(NON_EXISTENT)
    )

    try {
      await handler.handle(command)
      assert.fail('Should have thrown an error')
    } catch (error) {
      assert.instanceOf(error, ImageNotFoundError)
    }
  })

  test('should delete old thumbnail from storage', async ({ assert }) => {
    let deletedKey: string | null = null

    const mockMediaManager: MediaManagerInterface = {
      ...createMockMediaManager(),
      deleteFile: async (key: string) => {
        deletedKey = key
        return true
      },
    }

    const handler = new ReplaceMarketServiceThumbnailHandler(
      createMockRepository(),
      createMockImageRepository(),
      mockMediaManager
    )
    const command = new ReplaceMarketServiceThumbnailCommand(
      AppId.fromString(SERVICE_ID),
      AppId.fromString(NEW_THUMBNAIL_ID)
    )

    await handler.handle(command)

    assert.equal(deletedKey, 'images/old-thumbnail.jpg')
  })

  test('should delete old thumbnail from database', async ({ assert }) => {
    let deletedId: string | null = null

    const mockImageRepository: ImageMediaRepository = {
      ...createMockImageRepository(),
      delete: async (id: string) => {
        deletedId = id
      },
    }

    const handler = new ReplaceMarketServiceThumbnailHandler(
      createMockRepository(),
      mockImageRepository,
      createMockMediaManager()
    )
    const command = new ReplaceMarketServiceThumbnailCommand(
      AppId.fromString(SERVICE_ID),
      AppId.fromString(NEW_THUMBNAIL_ID)
    )

    await handler.handle(command)

    assert.equal(deletedId, OLD_THUMBNAIL_ID)
  })

  test('should not delete anything if service has no thumbnail', async ({ assert }) => {
    let fileDeleted = false
    let imageDeleted = false

    const mockMediaManager: MediaManagerInterface = {
      ...createMockMediaManager(),
      deleteFile: async () => {
        fileDeleted = true
        return true
      },
    }
    const mockImageRepository: ImageMediaRepository = {
      ...createMockImageRepository(),
      delete: async () => {
        imageDeleted = true
      },
    }

    const handler = new ReplaceMarketServiceThumbnailHandler(
      createMockRepository(createExistingMarketService(false)),
      mockImageRepository,
      mockMediaManager
    )
    const command = new ReplaceMarketServiceThumbnailCommand(
      AppId.fromString(SERVICE_ID),
      AppId.fromString(NEW_THUMBNAIL_ID)
    )

    await handler.handle(command)

    assert.isFalse(fileDeleted)
    assert.isFalse(imageDeleted)
  })

  test('should not delete file from storage if it does not exist', async ({ assert }) => {
    let fileDeleted = false

    const mockMediaManager: MediaManagerInterface = {
      ...createMockMediaManager(),
      fileExists: async () => false,
      deleteFile: async () => {
        fileDeleted = true
        return true
      },
    }

    const handler = new ReplaceMarketServiceThumbnailHandler(
      createMockRepository(),
      createMockImageRepository(),
      mockMediaManager
    )
    const command = new ReplaceMarketServiceThumbnailCommand(
      AppId.fromString(SERVICE_ID),
      AppId.fromString(NEW_THUMBNAIL_ID)
    )

    await handler.handle(command)

    assert.isFalse(fileDeleted)
  })

  test('should call imageRepository.findById with correct new thumbnail id', async ({ assert }) => {
    let capturedId: string | null = null

    const mockImageRepository: ImageMediaRepository = {
      ...createMockImageRepository(),
      findById: async (id: string) => {
        capturedId = id
        return createMockImage(NEW_THUMBNAIL_ID, 'images/new-thumbnail.jpg')
      },
    }

    const handler = new ReplaceMarketServiceThumbnailHandler(
      createMockRepository(),
      mockImageRepository,
      createMockMediaManager()
    )
    const command = new ReplaceMarketServiceThumbnailCommand(
      AppId.fromString(SERVICE_ID),
      AppId.fromString(NEW_THUMBNAIL_ID)
    )

    await handler.handle(command)

    assert.equal(capturedId, NEW_THUMBNAIL_ID)
  })
})
