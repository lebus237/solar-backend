import EntityManager from '#database/active-records/staff_member'
import { StaffMemberCollection } from '#kernel/staff/application/collection/staff_member_collection'
import { StaffMemberListItemDto } from '#kernel/staff/application/dto/staff_member_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ListStaffMembersQuery } from '#kernel/staff/application/query/list_staff_members_query'
import { ModelQueryBuilderHelper } from '#shared/infrastructure/persistence/model_query_builder'
import { mapPaginatedResult } from '#shared/infrastructure/collection/paginated_result'

export class StaffMemberARCollection
  extends ModelQueryBuilderHelper
  implements StaffMemberCollection
{
  async list(query: ListStaffMembersQuery): Promise<PaginatedResultDto<StaffMemberListItemDto>> {
    let queryBuilder = EntityManager.query()

    if (query.searchQuery.search) {
      queryBuilder.whereILike('full_name', `%${query.searchQuery.search}%`)
    }

    this.applySort(query.order, ['created_at'], queryBuilder)

    const result = await this.applyPaginate(query.pagination, queryBuilder)

    return mapPaginatedResult<any, StaffMemberListItemDto>(result as any, (sm) => ({
      id: sm.id,
      fullName: sm.fullName,
      email: sm.email,
      phone: sm.phone,
      jobTitle: sm.jobTitle,
      department: sm.department,
      role: sm.role,
      status: sm.status,
      profileImageUrl: sm.profileImageUrl,
      createdAt: sm.createdAt,
      updatedAt: sm.updatedAt,
    }))
  }
}
