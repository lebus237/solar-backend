import { test } from '@japa/runner'
import { UpdateStaffMemberHandler } from '#kernel/staff/application/command-handler/update_staff_member_handler'
import { UpdateStaffMemberCommand } from '#kernel/staff/application/command/update_staff_member_command'
import { StaffMemberRepository } from '#kernel/staff/domain/repository/staff_member_repository'
import { StaffMember } from '#kernel/staff/domain/entity/staff_member'
import { AppId } from '#shared/domain/app_id'

const STAFF_ID = '00000000-0000-4000-8000-000000000001'
const USER_ID = '00000000-0000-4000-8000-000000000002'
const OLD_IMG_ID = '00000000-0000-4000-8000-000000000003'
const NEW_IMG_ID = '00000000-0000-4000-8000-000000000004'

const makeExistingStaffMember = () =>
  new StaffMember(
    AppId.fromString(STAFF_ID),
    AppId.fromString(USER_ID),
    'John Doe',
    'john.doe@example.com',
    '+2348012345678',
    { name: 'Jane Doe', phone: '+2348098765432' },
    'Solar Engineer',
    'Engineering',
    'full_time',
    'staff',
    'active',
    AppId.fromString(OLD_IMG_ID),
    'https://example.com/old-profile.jpg',
    new Date('2024-01-01'),
    new Date('2024-01-15')
  )

const makeMockRepository = (
  existingEntity: StaffMember,
  onSave?: (entity: StaffMember) => void
): StaffMemberRepository => ({
  save: async (entity: StaffMember) => {
    onSave?.(entity)
  },
  findById: async (_id: AppId) => existingEntity,
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

test.group('UpdateStaffMemberHandler', () => {
  test('should fetch existing staff member by id from repository', async ({ assert }) => {
    let capturedId: AppId | null = null
    const existingEntity = makeExistingStaffMember()

    const mockRepository: StaffMemberRepository = {
      ...makeMockRepository(existingEntity),
      findById: async (id: AppId) => {
        capturedId = id
        return existingEntity
      },
    }

    const handler = new UpdateStaffMemberHandler(mockRepository)
    const command = new UpdateStaffMemberCommand(
      STAFF_ID,
      'Updated Name',
      'updated@example.com',
      null,
      null,
      'Senior Engineer',
      null,
      'full_time',
      'staff',
      'active',
      null,
      null
    )

    await handler.handle(command)

    assert.isNotNull(capturedId)
    assert.equal(capturedId!.value, STAFF_ID)
  })

  test('should update all mutable fields on the entity', async ({ assert }) => {
    let savedEntity: StaffMember | null = null
    const existingEntity = makeExistingStaffMember()

    const mockRepository = makeMockRepository(existingEntity, (entity) => {
      savedEntity = entity
    })

    const handler = new UpdateStaffMemberHandler(mockRepository)
    const command = new UpdateStaffMemberCommand(
      STAFF_ID,
      'Jane Smith',
      'jane.smith@example.com',
      '+2348099999999',
      { name: 'Bob', phone: '+2348011111111' },
      'Senior Engineer',
      'Operations',
      'part_time',
      'manager',
      'inactive',
      NEW_IMG_ID,
      'https://example.com/new-profile.jpg'
    )

    await handler.handle(command)

    assert.isNotNull(savedEntity)
    assert.equal(savedEntity!.getFullName(), 'Jane Smith')
    assert.equal(savedEntity!.getEmail(), 'jane.smith@example.com')
    assert.equal(savedEntity!.getPhone(), '+2348099999999')
    assert.deepEqual(savedEntity!.getEmergencyContact(), { name: 'Bob', phone: '+2348011111111' })
    assert.equal(savedEntity!.getJobTitle(), 'Senior Engineer')
    assert.equal(savedEntity!.getDepartment(), 'Operations')
    assert.equal(savedEntity!.getEmploymentType(), 'part_time')
    assert.equal(savedEntity!.getRole(), 'manager')
    assert.equal(savedEntity!.getStatus(), 'inactive')
    assert.equal(savedEntity!.getProfileImageId()!.value, NEW_IMG_ID)
    assert.equal(savedEntity!.getProfileImageUrl(), 'https://example.com/new-profile.jpg')
  })

  test('should call repository.save after updating entity', async ({ assert }) => {
    let saveCalled = false
    const existingEntity = makeExistingStaffMember()

    const mockRepository = makeMockRepository(existingEntity, () => {
      saveCalled = true
    })

    const handler = new UpdateStaffMemberHandler(mockRepository)
    const command = new UpdateStaffMemberCommand(
      STAFF_ID,
      'Updated Name',
      'updated@example.com',
      null,
      null,
      'Engineer',
      null,
      'full_time',
      'staff',
      'active',
      null,
      null
    )

    await handler.handle(command)

    assert.isTrue(saveCalled)
  })

  test('should set profileImageId to null when not provided in command', async ({ assert }) => {
    let savedEntity: StaffMember | null = null
    const existingEntity = makeExistingStaffMember()

    const mockRepository = makeMockRepository(existingEntity, (entity) => {
      savedEntity = entity
    })

    const handler = new UpdateStaffMemberHandler(mockRepository)
    const command = new UpdateStaffMemberCommand(
      STAFF_ID,
      'John Doe',
      'john.doe@example.com',
      null,
      null,
      'Engineer',
      null,
      'full_time',
      'staff',
      'active',
      null,
      null
    )

    await handler.handle(command)

    assert.isNull(savedEntity!.getProfileImageId())
    assert.isNull(savedEntity!.getProfileImageUrl())
  })

  test('should set phone and emergencyContact to null when not provided', async ({ assert }) => {
    let savedEntity: StaffMember | null = null
    const existingEntity = makeExistingStaffMember()

    const mockRepository = makeMockRepository(existingEntity, (entity) => {
      savedEntity = entity
    })

    const handler = new UpdateStaffMemberHandler(mockRepository)
    const command = new UpdateStaffMemberCommand(
      STAFF_ID,
      'John Doe',
      'john.doe@example.com',
      null,
      null,
      'Engineer',
      null,
      'full_time',
      'staff',
      'active',
      null,
      null
    )

    await handler.handle(command)

    assert.isNull(savedEntity!.getPhone())
    assert.isNull(savedEntity!.getEmergencyContact())
  })

  test('should update status from active to inactive', async ({ assert }) => {
    let savedEntity: StaffMember | null = null
    const existingEntity = makeExistingStaffMember()

    const mockRepository = makeMockRepository(existingEntity, (entity) => {
      savedEntity = entity
    })

    const handler = new UpdateStaffMemberHandler(mockRepository)
    const command = new UpdateStaffMemberCommand(
      STAFF_ID,
      'John Doe',
      'john.doe@example.com',
      null,
      null,
      'Engineer',
      null,
      'full_time',
      'staff',
      'inactive',
      null,
      null
    )

    await handler.handle(command)

    assert.equal(savedEntity!.getStatus(), 'inactive')
  })
})
