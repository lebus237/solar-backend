import { test } from '@japa/runner'
import { DeleteStaffMemberHandler } from '#kernel/staff/application/command-handler/delete_staff_member_handler'
import { DeleteStaffMemberCommand } from '#kernel/staff/application/command/delete_staff_member_command'
import { StaffMemberRepository } from '#kernel/staff/domain/repository/staff_member_repository'
import { AppId } from '#shared/domain/app_id'

const STAFF_ID = '00000000-0000-4000-8000-000000000001'

const makeMockRepository = (onDelete?: (id: AppId) => void): StaffMemberRepository => ({
  save: async () => {
    throw new Error('Not implemented')
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
  delete: async (id: AppId) => {
    onDelete?.(id)
  },
})

test.group('DeleteStaffMemberHandler', () => {
  test('should call repository.delete with correct AppId', async ({ assert }) => {
    let capturedId: AppId | null = null

    const mockRepository = makeMockRepository((id) => {
      capturedId = id
    })

    const handler = new DeleteStaffMemberHandler(mockRepository)
    const command = new DeleteStaffMemberCommand(STAFF_ID)

    await handler.handle(command)

    assert.isNotNull(capturedId)
    assert.equal(capturedId!.value, STAFF_ID)
  })

  test('should call repository.delete exactly once', async ({ assert }) => {
    let deleteCallCount = 0

    const mockRepository = makeMockRepository(() => {
      deleteCallCount++
    })

    const handler = new DeleteStaffMemberHandler(mockRepository)
    const command = new DeleteStaffMemberCommand(STAFF_ID)

    await handler.handle(command)

    assert.equal(deleteCallCount, 1)
  })

  test('should convert command id string to AppId before deleting', async ({ assert }) => {
    let capturedId: AppId | null = null

    const mockRepository = makeMockRepository((id) => {
      capturedId = id
    })

    const handler = new DeleteStaffMemberHandler(mockRepository)
    const command = new DeleteStaffMemberCommand(STAFF_ID)

    await handler.handle(command)

    assert.instanceOf(capturedId, AppId)
    assert.equal(capturedId!.value, STAFF_ID)
  })

  test('should throw when command id is not a valid UUID', async ({ assert }) => {
    const mockRepository = makeMockRepository()
    const handler = new DeleteStaffMemberHandler(mockRepository)
    const command = new DeleteStaffMemberCommand('not-a-valid-uuid')

    try {
      await handler.handle(command)
      assert.fail('Should have thrown an error for invalid UUID')
    } catch (error) {
      assert.instanceOf(error, Error)
    }
  })
})
