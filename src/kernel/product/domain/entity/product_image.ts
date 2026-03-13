import { AppId } from '#shared/domain/app_id'

export class ProductImage {
  constructor(
    public id: AppId,
    public url: string | null = null,
    public alt: string | null = null,
    public title: string | null = null
  ) {}
}
