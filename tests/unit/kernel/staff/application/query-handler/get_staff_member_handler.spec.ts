import { test } from '@japa/runner'
import { GetStaffMemberHandler } from '#kernel/staff/application/query-handler/get_staff_member_handler'
import { GetStaffMemberQuery } from '#kernel/staff/application/query/get_staff_member_query'
import { StaffMemberRepository } from '#kernel/staff/domain/repository/staff_member_repository'
import { StaffMember } from '#kernel/staff/domain/entity/staff_member'
import { AppId } from '#shared/domain/app_id'

const STAFF_ID = '00000000-0000-4000-8000-000000000001'
const USER_ID = '00000000-0000-4000-8000-000000000002'
const IMG_ID = '00000000-0000-4000-8000-000000000003'

const makeStaffMember = () =>
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
    AppId.fromString(IMG_ID),
    'https://example.com/profile.jpg',
    new Date('2024-01-01'),
    new Date('2024-01-15')
  )

const makeMockRepository = (entity: StaffMember): StaffMemberRepository => ({
  save: async () => {
    throw new Error('Not implemented')
  },
  findById: async (_id: AppId) => entity,
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

test.group('GetStaffMemberHandler', () => {
  test('should return staff member details dto when found', async ({ assert }) => {
    const staffMember = makeStaffMember()
    const mockRepository = makeMockRepository(staffMember)

    const handler = new GetStaffMemberHandler(mockRepository)
    const query = new GetStaffMemberQuery(STAFF_ID)

    const result = await handler.handle(query)

    assert.equal(result.id, STAFF_ID)
    assert.equal(result.userId, USER_ID)
    assert.equal(result.fullName, 'John Doe')
    assert.equal(result.email, 'john.doe@example.com')
    assert.equal(result.phone, '+2348012345678')
    assert.equal(result.jobTitle, 'Solar Engineer')
    assert.equal(result.department, 'Engineering')
    assert.equal(result.employmentType, 'full_time')
    assert.equal(result.role, 'staff')
    assert.equal(result.status, 'active')
    assert.equal(result.profileImageId, IMG_ID)
    assert.equal(result.profileImageUrl, 'https://example.com/profile.jpg')
  })

  test('should return emergency contact in dto', async ({ assert }) => {
    const staffMember = makeStaffMember()
    const mockRepository = makeMockRepository(staffMember)

    const handler = new GetStaffMemberHandler(mockRepository)
    const query = new GetStaffMemberQuery(STAFF_ID)

    const result = await handler.handle(query)

    assert.deepEqual(result.emergencyContact, { name: 'Jane Doe', phone: '+2348098765432' })
  })

  test('should return createdAt and updatedAt in dto', async ({ assert }) => {
    const staffMember = makeStaffMember()
    const mockRepository = makeMockRepository(staffMember)

    const handler = new GetStaffMemberHandler(mockRepository)
    const query = new GetStaffMemberQuery(STAFF_ID)

    const result = await handler.handle(query)

    assert.deepEqual(result.createdAt, new Date('2024-01-01'))
    assert.deepEqual(result.updatedAt, new Date('2024-01-15'))
  })

  test('should call repository.findById with correct AppId', async ({ assert }) => {
    let capturedId: AppId | null = null
    const staffMember = makeStaffMember()

    const mockRepository: StaffMemberRepository = {
      ...makeMockRepository(staffMember),
      findById: async (id: AppId) => {
        capturedId = id
        return staffMember
      },
    }

    const handler = new GetStaffMemberHandler(mockRepository)
    const query = new GetStaffMemberQuery(STAFF_ID)

    await handler.handle(query)

    assert.isNotNull(capturedId)
    assert.equal(capturedId!.value, STAFF_ID)
  })

  test('should return null for optional fields when not set on entity', async ({ assert }) => {
    const staffMember = new StaffMember(
      AppId.fromString(STAFF_ID),
      null,
      'Jane Smith',
      'jane.smith@example.com',
      null,
      null,
      'Technician',
      null,
      'contract',
      'staff',
      'active',
      null,
      null
    )

    const mockRepository = makeMockRepository(staffMember)
    const handler = new GetStaffMemberHandler(mockRepository)
    const query = new GetStaffMemberQuery(STAFF_ID)

    const result = await handler.handle(query)

    assert.isNull(result.userId)
    assert.isNull(result.phone)
    assert.isNull(result.emergencyContact)
    assert.isNull(result.department)
    assert.isNull(result.profileImageId)
    assert.isNull(result.profileImageUrl)
  })

  test('should propagate repository error when staff member not found', async ({ assert }) => {
    const mockRepository: StaffMemberRepository = {
      save: async () => {
        throw new Error('Not implemented')
      },
      findById: async () => {
        throw new Error('Staff member not found')
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
    }

    const handler = new GetStaffMemberHandler(mockRepository)
    const query = new GetStaffMemberQuery(STAFF_ID)

    try {
      await handler.handle(query)
      assert.fail('Should have thrown an error')
    } catch (error) {
      assert.instanceOf(error, Error)
      assert.equal((error as Error).message, 'Staff member not found')
    }
  })
})
