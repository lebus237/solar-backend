import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { ProductPack } from '#kernel/product/domain/entity/product_pack'
import { AppId } from '#shared/domain/app_id'

export interface ProductPackRepository extends RepositoryInterface {
  save(entity: ProductPack): Promise<void>
  find(id: AppId): Promise<ProductPack>
  delete(id: AppId): Promise<void>
}
