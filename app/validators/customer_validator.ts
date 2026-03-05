import vine from '@vinejs/vine'

export const createCustomerSchema = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(100),
    lastName: vine.string().trim().minLength(2).maxLength(100),
    phone: vine.string().trim().minLength(10).maxLength(20),
    email: vine.string().trim().email().maxLength(255).optional(),
    userId: vine.string().trim().uuid().optional(),
  })
)

export const updateCustomerSchema = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2).maxLength(100),
    lastName: vine.string().trim().minLength(2).maxLength(100),
    phone: vine.string().trim().minLength(10).maxLength(20),
    email: vine.string().trim().email().maxLength(255).optional(),
  })
)

export const createAddressSchema = vine.compile(
  vine.object({
    addressLine1: vine.string().trim().maxLength(255),
    addressLine2: vine.string().trim().maxLength(255).nullable().optional(),
    city: vine.string().trim().maxLength(100),
    state: vine.string().trim().maxLength(100),
    postalCode: vine.string().trim().maxLength(20),
    country: vine.string().trim().maxLength(100),
    type: vine.enum(['shipping', 'billing']),
    isDefault: vine.boolean().optional(),
  })
)

export const updateAddressSchema = vine.compile(
  vine.object({
    addressLine1: vine.string().trim().maxLength(255).optional(),
    addressLine2: vine.string().trim().maxLength(255).nullable().optional(),
    city: vine.string().trim().maxLength(100).optional(),
    state: vine.string().trim().maxLength(100).optional(),
    postalCode: vine.string().trim().maxLength(20).optional(),
    country: vine.string().trim().maxLength(100).optional(),
    type: vine.enum(['shipping', 'billing']).optional(),
    isDefault: vine.boolean().optional(),
  })
)
