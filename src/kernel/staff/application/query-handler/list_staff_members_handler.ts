import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import { ListStaffMembersQuery } from '#kernel/staff/application/query/list_staff_members_query'
import { StaffMemberListItemDto } from '#kernel/staff/application/dto/staff_member_read_dto'
import { StaffMemberCollection } from '#kernel/staff/application/collection/staff_member_collection'

export class ListStaffMembersHandler implements QueryHandler<
  ListStaffMembersQuery,
  PaginatedResultDto<StaffMemberListItemDto>
> {
  constructor(private readonly collection: StaffMemberCollection) {}

  async handle(query: ListStaffMembersQuery): Promise<PaginatedResultDto<StaffMemberListItemDto>> {
    return this.collection.list(query)
  }
}
