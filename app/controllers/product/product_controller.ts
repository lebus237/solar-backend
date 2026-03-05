/* eslint-disable prettier/prettier */
import { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { CreateProductCommand } from '#kernel/product/application/command/create_product_command'
import { createProductSchema, updateProductSchema } from '#validators/product_validator'
import { UpdateProductCommand } from '#kernel/product/application/command/update_product_command'
import ActiveRecord from '#database/active-records/product'
import app from '@adonisjs/core/services/app'
import { MediaManagerInterface } from '#shared/application/services/upload/media_manager_interface'

export default class ProductController extends AppAbstractController {
  constructor() {
    super()
  }

  public async index({ response, request }: HttpContext) {
    const query = request.qs()
    const result = await ActiveRecord.query()
      .whereILike('designation', `%${query.q || ''}%`)
      .orderBy('created_at', query.sort || 'desc')
      .paginate(query.page || 1, query.limit || 10)

    const mediaUploadService = (await app.container.make(
      'MediaUploadService'
    )) as MediaManagerInterface
    const paginatedResult = result.toJSON()

    paginatedResult.data = await Promise.all(
      paginatedResult.data.map(async (product: any) => {
        let mainImageSignedUrl = null
        const relativeKey = product.mainImage?.relativeKey || product.mainImage?.relative_key
        if (relativeKey) {
          mainImageSignedUrl = await mediaUploadService.getSignedUrl(relativeKey)
        }
        if (product.mainImage) {
          delete product.mainImage.url
        }

        return {
          id: product.id,
          slug: product.slug,
          designation: product.designation,
          price: product.price,
          category: {
            designation: product.category?.designation,
            id: product.category?.id,
          },
          mainImage: {
            url: mainImageSignedUrl,
            alt: product.mainImage?.altDescription,
            title: product.mainImage?.title,
          },
          stockQuantity: product.stockQuantity,
          brand: product.brand,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        }
      })
    )

    return response.ok(paginatedResult)
  }

  public async show({ request, response }: HttpContext) {
    const productId = await request.param('id')

    const product = await ActiveRecord.find(productId)

    if(!product){
      return response.notFound({ message: 'Product not found' })
    }

    const mediaUploadService = (await app.container.make(
      'MediaUploadService'
    )) as MediaManagerInterface

    // Get signed URL for main image
    let mainImageSignedUrl = null
    const mainImageRelativeKey = product?.mainImage?.relativeKey || (product?.mainImage as any)?.relative_key
    if (mainImageRelativeKey) {
      mainImageSignedUrl = await mediaUploadService.getSignedUrl(mainImageRelativeKey)
    }

    // Get signed URLs for additional images
    const images = await Promise.all(
      (product?.images || []).map(async (img: any) => {
        let signedUrl = null
        const relativeKey = img.relativeKey || img.relative_key
        if (relativeKey) {
          signedUrl = await mediaUploadService.getSignedUrl(relativeKey)
        }
        return {
          id: img.id,
          url: signedUrl,
          alt: img.altDescription,
          title: img.title,
        }
      })
    )

    return response.ok({
      data: {
        id: product?.id,
        slug: product?.slug,
        categoryId: product?.categoryId,
        designation: product?.designation,
        description: product?.description,
        price: product?.price,
        brand: product?.brand,
        isAvailable: product?.isAvailable,
        isDeleted: product?.isDeleted,
        createdAt: product?.createdAt,
        updatedAt: product?.updatedAt,
        category: {
          id: product?.category?.id,
          designation: product?.category?.designation,
        },
        mainImage: {
          id: product?.mainImage?.id,
          url: mainImageSignedUrl,
          alt: product?.mainImage?.altDescription,
          title: product?.mainImage?.title,
        },
        images: images,
      },
    })
  }

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductSchema)

    await this.handleCommand(
      new CreateProductCommand(
        payload.designation,
        payload.mainImageId,
        payload.categoryId,
        payload.description,
        payload.price,
        payload.brand,
        payload.imageIds || []
      )
    )
    return response.created()
  }

  public async update({ request, response }: HttpContext) {
    const payload = await request.validateUsing(updateProductSchema)
    const productId = await request.param('id')

    await this.handleCommand(
      new UpdateProductCommand(
        productId,
        payload.designation,
        payload.mainImageId,
        payload.categoryId,
        payload.description,
        payload.price,
        payload.brand,
        undefined, // isAvailable
        undefined, // isDeleted
        payload.imageIds || []
      )
    )
    return response.noContent()
  }

  public async groupedByCategory({ response, request }: HttpContext) {
    const query = request.qs()
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10

    const result = await ActiveRecord.query()
      .whereILike('designation', `%${query.q || ''}%`)
      .orderBy('category_id')
      .paginate(page, limit)

    const mediaUploadService = (await app.container.make(
      'MediaUploadService'
    )) as MediaManagerInterface

    const paginatedResult = result.toJSON()

    const formattedProducts = await Promise.all(
      paginatedResult.data.map(async (product: any) => {
        let mainImageSignedUrl = null
        const relativeKey = product.mainImage?.relativeKey || product.mainImage?.relative_key
        if (relativeKey) {
          mainImageSignedUrl = await mediaUploadService.getSignedUrl(relativeKey)
        }
        if (product.mainImage) {
          delete product.mainImage.url
        }

        return {
          id: product.id,
          slug: product.slug,
          designation: product.designation,
          price: product.price,
          categoryName: product.category?.designation,
          categoryId: product.category?.id,
          mainImageUrl: mainImageSignedUrl,
          brand: product.brand,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        }
      })
    )

    // Group products by category
    const groupedProducts = formattedProducts.reduce(
      (
        acc: Record<string, { categoryId: string; categoryName: string; products: any[] }>,
        product
      ) => {
        const categoryId = product.categoryId || 'uncategorized'
        const categoryName = product.categoryName || 'Uncategorized'

        if (!acc[categoryId]) {
          acc[categoryId] = {
            categoryId,
            categoryName,
            products: [],
          }
        }
        acc[categoryId].products.push(product)
        return acc
      },
      {}
    )

    return response.ok({
      meta: paginatedResult.meta,
      data: Object.values(groupedProducts),
    })
  }
}
