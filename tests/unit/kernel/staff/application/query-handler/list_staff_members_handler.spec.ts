import { test } from '@japa/runner'
import { ListStaffMembersHandler } from '#kernel/staff/application/query-handler/list_staff_members_handler'
import { ListStaffMembersQuery } from '#kernel/staff/application/query/list_staff_members_query'
import { StaffMemberCollection } from '#kernel/staff/application/collection/staff_member_collection'
import { StaffMemberListItemDto } from '#kernel/staff/application/dto/staff_member_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { Pagination } from '#shared/application/query-options/pagination'
import { QuerySearch } from '#shared/application/query-options/query_search'
import { Sort } from '#shared/application/query-options/sort'

const createMockStaffMemberItem = (): StaffMemberListItemDto => ({
  id: '00000000-0000-4000-8000-000000000001',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+2348012345678',
  jobTitle: 'Solar Engineer',
  department: 'Engineering',
  role: 'staff',
  status: 'active',
  profileImageUrl: 'https://example.com/profile.jpg',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
})

const createMockPaginatedResult = (): PaginatedResultDto<StaffMemberListItemDto> => ({
  data: [createMockStaffMemberItem()],
  meta: {
    currentPage: 1,
    perPage: 10,
    total: 1,
    totalPages: 1,
  },
})

const createDefaultQuery = () =>
  new ListStaffMembersQuery(
    new Pagination(1, 10),
    new QuerySearch(''),
    new Sort({ created_at: 'desc' })
  )

test.group('ListStaffMembersHandler', () => {
  test('should return paginated list of staff members', async ({ assert }) => {
    const mockResult = createMockPaginatedResult()

    const mockCollection: StaffMemberCollection = {
      list: async () => mockResult,
    }

    const handler = new ListStaffMembersHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    assert.deepEqual(result, mockResult)
    assert.lengthOf(result.data, 1)
  })

  test('should delegate to collection.list with the query', async ({ assert }) => {
    let capturedQuery: ListStaffMembersQuery | null = null
    const mockResult = createMockPaginatedResult()

    const mockCollection: StaffMemberCollection = {
      list: async (q) => {
        capturedQuery = q
        return mockResult
      },
    }

    const handler = new ListStaffMembersHandler(mockCollection)
    const query = createDefaultQuery()

    await handler.handle(query)

    assert.deepEqual(capturedQuery, query)
  })

  test('should return empty list when no staff members exist', async ({ assert }) => {
    const emptyResult: PaginatedResultDto<StaffMemberListItemDto> = {
      data: [],
      meta: {
        currentPage: 1,
        perPage: 10,
        total: 0,
        totalPages: 0,
      },
    }

    const mockCollection: StaffMemberCollection = {
      list: async () => emptyResult,
    }

    const handler = new ListStaffMembersHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    assert.lengthOf(result.data, 0)
    assert.equal(result.meta.total, 0)
  })

  test('should return correct pagination metadata', async ({ assert }) => {
    const mockResult = createMockPaginatedResult()

    const mockCollection: StaffMemberCollection = {
      list: async () => mockResult,
    }

    const handler = new ListStaffMembersHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    assert.equal(result.meta.currentPage, 1)
    assert.equal(result.meta.perPage, 10)
    assert.equal(result.meta.total, 1)
    assert.equal(result.meta.totalPages, 1)
  })

  test('should return staff member list item with correct fields', async ({ assert }) => {
    const mockResult = createMockPaginatedResult()

    const mockCollection: StaffMemberCollection = {
      list: async () => mockResult,
    }

    const handler = new ListStaffMembersHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)
    const item = result.data[0]

    assert.equal(item.id, '00000000-0000-4000-8000-000000000001')
    assert.equal(item.fullName, 'John Doe')
    assert.equal(item.email, 'john.doe@example.com')
    assert.equal(item.phone, '+2348012345678')
    assert.equal(item.jobTitle, 'Solar Engineer')
    assert.equal(item.department, 'Engineering')
    assert.equal(item.role, 'staff')
    assert.equal(item.status, 'active')
    assert.equal(item.profileImageUrl, 'https://example.com/profile.jpg')
  })

  test('should pass query with search term to collection', async ({ assert }) => {
    let capturedQuery: ListStaffMembersQuery | null = null
    const mockResult = createMockPaginatedResult()

    const mockCollection: StaffMemberCollection = {
      list: async (q) => {
        capturedQuery = q
        return mockResult
      },
    }

    const handler = new ListStaffMembersHandler(mockCollection)
    const query = new ListStaffMembersQuery(
      new Pagination(1, 10),
      new QuerySearch('John'),
      new Sort({ created_at: 'asc' })
    )

    await handler.handle(query)

    assert.equal(capturedQuery!.searchQuery.search, 'John')
    assert.equal(capturedQuery!.order.entries.created_at, 'asc')
  })

  test('should return multiple staff members when collection has many', async ({ assert }) => {
    const secondItem: StaffMemberListItemDto = {
      id: '00000000-0000-4000-8000-000000000002',
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: null,
      jobTitle: 'Technician',
      department: null,
      role: 'manager',
      status: 'inactive',
      profileImageUrl: null,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-15'),
    }

    const multiResult: PaginatedResultDto<StaffMemberListItemDto> = {
      data: [createMockStaffMemberItem(), secondItem],
      meta: {
        currentPage: 1,
        perPage: 10,
        total: 2,
        totalPages: 1,
      },
    }

    const mockCollection: StaffMemberCollection = {
      list: async () => multiResult,
    }

    const handler = new ListStaffMembersHandler(mockCollection)
    const query = createDefaultQuery()

    const result = await handler.handle(query)

    assert.lengthOf(result.data, 2)
    assert.equal(result.meta.total, 2)
    assert.equal(result.data[1].fullName, 'Jane Smith')
    assert.equal(result.data[1].role, 'manager')
    assert.isNull(result.data[1].phone)
    assert.isNull(result.data[1].department)
    assert.isNull(result.data[1].profileImageUrl)
  })
})
