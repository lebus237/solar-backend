import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { DeleteStaffMemberCommand } from '#kernel/staff/application/command/delete_staff_member_command'
import { StaffMemberRepository } from '#kernel/staff/domain/repository/staff_member_repository'
import { AppId } from '#shared/domain/app_id'

export class DeleteStaffMemberHandler implements CommandHandler<DeleteStaffMemberCommand> {
  constructor(private staffMemberRepository: StaffMemberRepository) {}

  async handle(command: DeleteStaffMemberCommand): Promise<void> {
    await this.staffMemberRepository.delete(AppId.fromString(command.id))
  }
}
