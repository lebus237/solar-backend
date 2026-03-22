import vine from '@vinejs/vine'

export const createStoreSchema = vine.compile(
  vine.object({
    designation: vine.string().minLength(1),
    address: vine.object({
      street: vine.string(),
      city: vine.string(),
      country: vine.string().optional(),
      postalCode: vine.string().optional(),
    }),
    phoneNumber1: vine.object({
      countryCode: vine.string(),
      number: vine.string(),
    }),
    businessHours: vine.array(
      vine.object({
        day: vine.number(),
        startTime: vine.number(),
        endTime: vine.number(),
      })
    ),
    phoneNumber2: vine
      .object({
        countryCode: vine.string(),
        number: vine.string(),
      })
      .optional(),
    whatsappNumber: vine
      .object({
        countryCode: vine.string(),
        number: vine.string(),
      })
      .optional(),
  })
)

export const updateStoreSchema = createStoreSchema
