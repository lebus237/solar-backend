import vine from '@vinejs/vine'

export const createProductSchema = vine.compile(
  vine.object({
    designation: vine.string().minLength(2),
    description: vine.string(),
    categoryId: vine.string().uuid(),
    pictureUrl: vine.string(),
    price: vine.number(),
    brand: vine.string().optional(),
  })
)

export const updateProductSchema = vine.compile(
  vine.object({
    designation: vine.string().minLength(2),
    description: vine.string(),
    categoryId: vine.string().uuid(),
    pictureUrl: vine.string(),
    price: vine.number(),
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
