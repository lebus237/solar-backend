import { test } from '@japa/runner'
import { CreateStaffMemberHandler } from '#kernel/staff/application/command-handler/create_staff_member_handler'
import { CreateStaffMemberCommand } from '#kernel/staff/application/command/create_staff_member_command'
import { StaffMemberRepository } from '#kernel/staff/domain/repository/staff_member_repository'
import { StaffMember } from '#kernel/staff/domain/entity/staff_member'
import { AppId } from '#shared/domain/app_id'

const STAFF_ID = '00000000-0000-4000-8000-000000000001'
const USER_ID = '00000000-0000-4000-8000-000000000002'
const IMG_ID = '00000000-0000-4000-8000-000000000003'

/**
 * Simulates the repository's save behaviour: assigns a generated ID to the entity
 * when it has no ID yet (i.e. on creation).
 */
const makeMockRepository = (onSave?: (entity: StaffMember) => void): StaffMemberRepository => ({
  save: async (entity: StaffMember) => {
    if (!entity.getId()) {
      entity.setId(AppId.fromString(STAFF_ID))
    }
    onSave?.(entity)
  },
  findById: async () => {
    throw new Error('Not implemented')
  },
  findAll: async () => {
    throw new Error('Not implemented')
  },
  findByUserId: async () => {
    throw new Error('Not implemented')
  },
  findByEmail: async () => {
    throw new Error('Not implemented')
  },
  delete: async () => {
    throw new Error('Not implemented')
  },
})

test.group('CreateStaffMemberHandler', () => {
  test('should create staff member and return generated id', async ({ assert }) => {
    const mockRepository = makeMockRepository()
    const handler = new CreateStaffMemberHandler(mockRepository)

    const command = new CreateStaffMemberCommand(
      USER_ID,
      'John Doe',
      'john.doe@example.com',
      '+2348012345678',
      { name: 'Jane Doe', phone: '+2348098765432' },
      'Solar Engineer',
      'Engineering',
      'full_time',
      'staff',
      IMG_ID,
      'https://example.com/profile.jpg'
    )

    const result = await handler.handle(command)

    assert.equal(result, STAFF_ID)
  })

  test('should call repository.save with correct staff member entity', async ({ assert }) => {
    let savedEntity: StaffMember | null = null

    const mockRepository = makeMockRepository((entity) => {
      savedEntity = entity
    })

    const handler = new CreateStaffMemberHandler(mockRepository)
    const command = new CreateStaffMemberCommand(
      USER_ID,
      'John Doe',
      'john.doe@example.com',
      '+2348012345678',
      null,
      'Solar Engineer',
      'Engineering',
      'full_time',
      'staff',
      null,
      null
    )

    await handler.handle(command)

    assert.isNotNull(savedEntity)
    assert.equal(savedEntity!.getFullName(), 'John Doe')
    assert.equal(savedEntity!.getEmail(), 'john.doe@example.com')
    assert.equal(savedEntity!.getPhone(), '+2348012345678')
    assert.equal(savedEntity!.getJobTitle(), 'Solar Engineer')
    assert.equal(savedEntity!.getDepartment(), 'Engineering')
    assert.equal(savedEntity!.getEmploymentType(), 'full_time')
    assert.equal(savedEntity!.getRole(), 'staff')
  })

  test('should set status to "active" on creation', async ({ assert }) => {
    let savedEntity: StaffMember | null = null

    const mockRepository = makeMockRepository((entity) => {
      savedEntity = entity
    })

    const handler = new CreateStaffMemberHandler(mockRepository)
    const command = new CreateStaffMemberCommand(
      null,
      'Jane Smith',
      'jane.smith@example.com',
      null,
      null,
      'Technician',
      null,
      'contract',
      'staff',
      null,
      null
    )

    await handler.handle(command)

    assert.equal(savedEntity!.getStatus(), 'active')
  })

  test('should map userId string to AppId when provided', async ({ assert }) => {
    let savedEntity: StaffMember | null = null

    const mockRepository = makeMockRepository((entity) => {
      savedEntity = entity
    })

    const handler = new CreateStaffMemberHandler(mockRepository)
    const command = new CreateStaffMemberCommand(
      USER_ID,
      'John Doe',
      'john.doe@example.com',
      null,
      null,
      'Engineer',
      null,
      'full_time',
      'staff',
      null,
      null
    )

    await handler.handle(command)

    assert.equal(savedEntity!.getUserId()!.value, USER_ID)
  })

  test('should set userId to null when not provided', async ({ assert }) => {
    let savedEntity: StaffMember | null = null

    const mockRepository = makeMockRepository((entity) => {
      savedEntity = entity
    })

    const handler = new CreateStaffMemberHandler(mockRepository)
    const command = new CreateStaffMemberCommand(
      null,
      'John Doe',
      'john.doe@example.com',
      null,
      null,
      'Engineer',
      null,
      'full_time',
      'staff',
      null,
      null
    )

    await handler.handle(command)

    assert.isNull(savedEntity!.getUserId())
  })

  test('should map profileImageId string to AppId when provided', async ({ assert }) => {
    let savedEntity: StaffMember | null = null

    const mockRepository = makeMockRepository((entity) => {
      savedEntity = entity
    })

    const handler = new CreateStaffMemberHandler(mockRepository)
    const command = new CreateStaffMemberCommand(
      null,
      'John Doe',
      'john.doe@example.com',
      null,
      null,
      'Engineer',
      null,
      'full_time',
      'staff',
      IMG_ID,
      'https://example.com/profile.jpg'
    )

    await handler.handle(command)

    assert.equal(savedEntity!.getProfileImageId()!.value, IMG_ID)
    assert.equal(savedEntity!.getProfileImageUrl(), 'https://example.com/profile.jpg')
  })

  test('should set profileImageId to null when not provided', async ({ assert }) => {
    let savedEntity: StaffMember | null = null

    const mockRepository = makeMockRepository((entity) => {
      savedEntity = entity
    })

    const handler = new CreateStaffMemberHandler(mockRepository)
    const command = new CreateStaffMemberCommand(
      null,
      'John Doe',
      'john.doe@example.com',
      null,
      null,
      'Engineer',
      null,
      'full_time',
      'staff',
      null,
      null
    )

    await handler.handle(command)

    assert.isNull(savedEntity!.getProfileImageId())
    assert.isNull(savedEntity!.getProfileImageUrl())
  })

  test('should pass emergency contact to entity when provided', async ({ assert }) => {
    let savedEntity: StaffMember | null = null

    const mockRepository = makeMockRepository((entity) => {
      savedEntity = entity
    })

    const handler = new CreateStaffMemberHandler(mockRepository)
    const emergencyContact = { name: 'Emergency Person', phone: '+2348011111111' }
    const command = new CreateStaffMemberCommand(
      null,
      'John Doe',
      'john.doe@example.com',
      null,
      emergencyContact,
      'Engineer',
      null,
      'full_time',
      'staff',
      null,
      null
    )

    await handler.handle(command)

    assert.deepEqual(savedEntity!.getEmergencyContact(), emergencyContact)
  })
})
