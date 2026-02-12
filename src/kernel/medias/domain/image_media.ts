import { AppId } from '#shared/domain/app_id'

export class ImageMedia {
  constructor(
    private readonly id: AppId | null,
    private readonly title: string,
    private readonly url: string,
    private readonly altDescription: string,
    private readonly metadata: Object,
    private readonly createdAt: Date | null,
    private readonly updatedAt: Date | null,
    private readonly relativeKey?: string,
    private readonly createdBy?: any
  ) {}

  getId() {
    return this.id?.value
  }

  getKey() {
    return this.relativeKey
  }
}
