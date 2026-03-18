import { StaffMemberListItemDto } from '#kernel/staff/application/dto/staff_member_read_dto'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ListStaffMembersQuery } from '#kernel/staff/application/query/list_staff_members_query'

export interface StaffMemberCollection {
  list(query: ListStaffMembersQuery): Promise<PaginatedResultDto<StaffMemberListItemDto>>
}
