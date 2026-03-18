import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { GetStaffMemberQuery } from '#kernel/staff/application/query/get_staff_member_query'
import { StaffMemberDetailsDto } from '#kernel/staff/application/dto/staff_member_read_dto'
import { StaffMemberRepository } from '#kernel/staff/domain/repository/staff_member_repository'
import { AppId } from '#shared/domain/app_id'

export class GetStaffMemberHandler implements QueryHandler<GetStaffMemberQuery, StaffMemberDetailsDto> {
  constructor(private readonly repository: StaffMemberRepository) {}

  async handle(query: GetStaffMemberQuery): Promise<StaffMemberDetailsDto> {
    const staffMember = await this.repository.findById(AppId.fromString(query.id))

    return {
      id: staffMember.getId()!.value,
      userId: staffMember.getUserId()?.value ?? null,
      fullName: staffMember.getFullName(),
      email: staffMember.getEmail(),
      phone: staffMember.getPhone(),
      emergencyContact: staffMember.getEmergencyContact(),
      jobTitle: staffMember.getJobTitle(),
      department: staffMember.getDepartment(),
      employmentType: staffMember.getEmploymentType(),
      role: staffMember.getRole(),
      status: staffMember.getStatus(),
      profileImageId: staffMember.getProfileImageId()?.value ?? null,
      profileImageUrl: staffMember.getProfileImageUrl(),
      createdAt: staffMember.getCreatedAt(),
      updatedAt: staffMember.getUpdatedAt(),
    }
  }
}
