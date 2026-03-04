import vine from '@vinejs/vine'

export const addStockSchema = vine.compile(
  vine.object({
    quantity: vine.number().positive(),
    reason: vine.string().maxLength(255).optional(),
  })
)

export const removeStockSchema = vine.compile(
  vine.object({
    quantity: vine.number().positive(),
    reason: vine.string().maxLength(255).optional(),
  })
)

export const setStockSchema = vine.compile(
  vine.object({
    quantity: vine.number().min(0),
    reason: vine.string().maxLength(255).optional(),
  })
)

export const stockHistorySchema = vine.compile(
  vine.object({
    page: vine.number().min(1).optional(),
    limit: vine.number().min(1).max(100).optional(),
  })
)
