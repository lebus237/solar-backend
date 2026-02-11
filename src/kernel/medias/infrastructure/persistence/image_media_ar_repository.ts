import { ImageMediaRepository } from '#kernel/medias/domain/image_media_repository'
import { ImageMedia } from '#kernel/medias/domain/image_media'

export class ImageMediaARRepository implements ImageMediaRepository {
  save(entity: ImageMedia): Promise<void> {
    console.log('Saving market service:', entity)
    return Promise.resolve()
  }

  findById(_id: string): Promise<ImageMedia | null> {
    return Promise.resolve(null)
  }

  findByUrl(_url: string): Promise<ImageMedia | null> {
    return Promise.resolve(null)
  }
}
