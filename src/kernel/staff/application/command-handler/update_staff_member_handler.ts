import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { UpdateStaffMemberCommand } from '#kernel/staff/application/command/update_staff_member_command'
import { StaffMemberRepository } from '#kernel/staff/domain/repository/staff_member_repository'
import { AppId } from '#shared/domain/app_id'

export class UpdateStaffMemberHandler implements CommandHandler<UpdateStaffMemberCommand> {
  constructor(private staffMemberRepository: StaffMemberRepository) {}

  async handle(command: UpdateStaffMemberCommand): Promise<void> {
    const staffMember = await this.staffMemberRepository.findById(AppId.fromString(command.id))

    staffMember.setFullName(command.fullName)
    staffMember.setEmail(command.email)
    staffMember.setPhone(command.phone)
    staffMember.setEmergencyContact(command.emergencyContact)
    staffMember.setJobTitle(command.jobTitle)
    staffMember.setDepartment(command.department)
    staffMember.setEmploymentType(command.employmentType)
    staffMember.setRole(command.role)
    staffMember.setStatus(command.status)
    staffMember.setProfileImageId(
      command.profileImageId ? AppId.fromString(command.profileImageId) : null
    )
    staffMember.setProfileImageUrl(command.profileImageUrl)

    await this.staffMemberRepository.save(staffMember)
  }
}
