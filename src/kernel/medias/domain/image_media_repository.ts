import { RepositoryInterface } from '#shared/domain/repository_interface'
import { ImageMedia } from './image_media'

export interface ImageMediaRepository extends RepositoryInterface {
  save(imageMedia: ImageMedia): Promise<string | void>
  findById(id: string): Promise<ImageMedia | null>
  findByUrl(url: string): Promise<ImageMedia | null>
  delete(id: string): Promise<void>
}
