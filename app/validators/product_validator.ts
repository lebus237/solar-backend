import { MAX_PRODUCT_IMAGES } from '#kernel/product/domain/constant/index'
import vine from '@vinejs/vine'

export const createProductSchema = vine.compile(
  vine.object({
    designation: vine.string().minLength(2),
    description: vine.string(),
    categoryId: vine.string().uuid(),
    mainImageId: vine.string().uuid(),
    price: vine.number().positive(),
    brand: vine.string().optional(),
    imageIds: vine
      .array(vine.string().uuid())
      .maxLength(MAX_PRODUCT_IMAGES - 1)
      .optional(),
  })
)

export const updateProductSchema = vine.compile(
  vine.object({
    designation: vine.string().minLength(2),
    description: vine.string(),
    categoryId: vine.string().uuid(),
    price: vine.number().positive(),
    brand: vine.string().optional(),
  })
)

export const createProductCategorySchema = vine.compile(
  vine.object({
    designation: vine.string().minLength(2),
    type: vine.enum(['CATEGORY', 'TAG']).optional(),
    parentId: vine.string().uuid().optional(),
  })
)

export const updateProductCategorySchema = vine.compile(
  vine.object({
    designation: vine.string().minLength(2),
    type: vine.enum(['CATEGORY', 'TAG']),
    parentId: vine.string().uuid().optional(),
  })
)

export const addProductImageSchema = vine.compile(
  vine.object({
    imageId: vine.string().uuid(),
    isMainImage: vine.boolean(),
  })
)

export const removeProductImageSchema = vine.compile(
  vine.object({
    imageId: vine.string().uuid(),
  })
)
