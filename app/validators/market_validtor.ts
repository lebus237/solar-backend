import vine from '@vinejs/vine'

export const createMarketServiceSchema = vine.compile(
  vine.object({
    designation: vine.string(),
    thumbnailId: vine.string().uuid(),
    contentDescription: vine.any().optional(),
    shortDescription: vine.string(),
    features: vine.array(vine.any()).optional(),
  })
)

export const updateMarketServiceSchema = vine.compile(
  vine.object({
    designation: vine.string(),
    contentDescription: vine.any().optional(),
    shortDescription: vine.string(),
    features: vine.array(vine.any()).optional(),
  })
)

export const replaceThumbnailSchema = vine.compile(
  vine.object({
    thumbnailId: vine.string().uuid(),
  })
)
