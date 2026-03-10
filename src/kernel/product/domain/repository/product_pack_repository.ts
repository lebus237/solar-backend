import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { ProductPack } from '#kernel/product/domain/entity/product_pack'
import { ProductPackId } from '#shared/domain/types/branded_types'

export interface ProductPackRepository extends RepositoryInterface {
  save(entity: ProductPack): Promise<void>
  find(id: ProductPackId): Promise<ProductPack>
  delete(id: ProductPackId): Promise<void>
}
