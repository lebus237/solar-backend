import vine from '@vinejs/vine'

export const mediaSchema = vine.compile(
  vine.object({
    title: vine.string(),
    alt: vine.string(),
    image: vine.file(),
  })
)
