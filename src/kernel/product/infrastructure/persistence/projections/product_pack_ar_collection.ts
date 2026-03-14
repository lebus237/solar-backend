import {
  ProductPackDetailsDto,
  ProductPackItemDto,
} from '#kernel/product/application/dto/product_pack_read_dto'
import { ProductPackCollectionResult } from '#kernel/product/application/collection/product_pack_collection'
import { ProductPackListReadModel } from '#kernel/product/application/query-handler/list_product_packs_handler'
import { ListProductPacksQuery } from '#kernel/product/application/query/list_product_packs_query'
import { default as ProductPackActiveRecord } from '#database/active-records/product_pack'
import { ModelQueryBuilderHelper } from '#shared/infrastructure/persistence/model_query_builder'

export class ProductPackARCollection
  extends ModelQueryBuilderHelper
  implements ProductPackListReadModel
{
  async list(query: ListProductPacksQuery): Promise<ProductPackCollectionResult> {
    let packQuery = ProductPackActiveRecord.query()

    this.withRelation(['packItems', 'mainImage'], packQuery)
    packQuery.where('is_deleted', false)
    packQuery.whereILike('designation', `%${query.searchQuery.search}%`)

    // Apply sorting
    this.applySort(query.order, ['created_at', 'price'], packQuery)

    const result = await this.applyPaginate(query.pagination, packQuery)

    const data: ProductPackDetailsDto[] = result.all().map((pack) => {
      const items: ProductPackItemDto[] = pack.packItems.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product?.designation || '',
        productMainImageUrl: item.product?.mainImage?.url || null,
      }))

      return {
        id: pack.id,
        designation: pack.designation,
        slug: pack.slug,
        description: pack.description,
        price: pack.price,
        mainImageUrl: pack.mainImage?.url || null,
        stockQuantity: pack.stockQuantity,
        isAvailable: pack.isAvailable,
        items,
        createdAt: pack.createdAt.toISO()!,
        updatedAt: pack.updatedAt.toISO()!,
      }
    })

    return {
      data,
      meta: {
        total: result.total,
        perPage: query.pagination.limit,
        currentPage: query.pagination.page,
        lastPage: result.lastPage,
        firstPage: result.firstPage,
      },
    }
  }
}
