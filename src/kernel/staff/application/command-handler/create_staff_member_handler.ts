import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CreateStaffMemberCommand } from '#kernel/staff/application/command/create_staff_member_command'
import { StaffMemberRepository } from '#kernel/staff/domain/repository/staff_member_repository'
import { StaffMember } from '#kernel/staff/domain/entity/staff_member'
import { AppId } from '#shared/domain/app_id'

export class CreateStaffMemberHandler implements CommandHandler<CreateStaffMemberCommand, string> {
  constructor(private staffMemberRepository: StaffMemberRepository) {}

  async handle(command: CreateStaffMemberCommand): Promise<string> {
    const staffMember = new StaffMember(
      null,
      command.userId ? AppId.fromString(command.userId) : null,
      command.fullName,
      command.email,
      command.phone,
      command.emergencyContact,
      command.jobTitle,
      command.department,
      command.employmentType,
      command.role,
      'active',
      command.profileImageId ? AppId.fromString(command.profileImageId) : null,
      command.profileImageUrl
    )

    await this.staffMemberRepository.save(staffMember)

    return staffMember.getId()!.value
  }
}
