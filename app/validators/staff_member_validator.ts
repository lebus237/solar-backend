import vine from '@vinejs/vine'

export const createStaffMemberSchema = vine.compile(
  vine.object({
    userId: vine.string().trim().uuid().nullable().optional(),
    fullName: vine.string().trim().minLength(2).maxLength(100),
    email: vine.string().trim().email().maxLength(254),
    phone: vine.string().trim().maxLength(20).nullable().optional(),
    emergencyContact: vine
      .object({
        name: vine.string().trim().maxLength(100),
        phone: vine.string().trim().maxLength(20),
      })
      .nullable()
      .optional(),
    jobTitle: vine.string().trim().maxLength(100),
    department: vine.string().trim().maxLength(100).nullable().optional(),
    employmentType: vine.enum(['full_time', 'part_time', 'contract']),
    role: vine.enum(['admin', 'manager', 'staff']),
    profileImageId: vine.string().trim().uuid().nullable().optional(),
    profileImageUrl: vine.string().trim().maxLength(500).nullable().optional(),
  })
)

export const updateStaffMemberSchema = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(100),
    email: vine.string().trim().email().maxLength(254),
    phone: vine.string().trim().maxLength(20).nullable().optional(),
    emergencyContact: vine
      .object({
        name: vine.string().trim().maxLength(100),
        phone: vine.string().trim().maxLength(20),
      })
      .nullable()
      .optional(),
    jobTitle: vine.string().trim().maxLength(100),
    department: vine.string().trim().maxLength(100).nullable().optional(),
    employmentType: vine.enum(['full_time', 'part_time', 'contract']),
    role: vine.enum(['admin', 'manager', 'staff']),
    status: vine.enum(['active', 'inactive']),
    profileImageId: vine.string().trim().uuid().nullable().optional(),
    profileImageUrl: vine.string().trim().maxLength(500).nullable().optional(),
  })
)
