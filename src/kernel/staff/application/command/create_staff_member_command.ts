import { Command } from '#shared/application/use-cases/command'
import { StaffRoleType } from '#kernel/staff/domain/type/staff_role_type'
import { EmploymentType } from '#kernel/staff/domain/type/employment_type'
import { EmergencyContactType } from '#kernel/staff/domain/type/emergency_contact_type'

export class CreateStaffMemberCommand implements Command {
  readonly timestamp: Date

  constructor(
    public readonly userId: string | null,
    public readonly fullName: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly emergencyContact: EmergencyContactType | null,
    public readonly jobTitle: string,
    public readonly department: string | null,
    public readonly employmentType: EmploymentType,
    public readonly role: StaffRoleType,
    public readonly profileImageId: string | null,
    public readonly profileImageUrl: string | null
  ) {
    this.timestamp = new Date()
  }
}
