import { StaffMemberRepository } from '#kernel/staff/domain/repository/staff_member_repository'
import { StaffMember } from '#kernel/staff/domain/entity/staff_member'
import { AppId } from '#shared/domain/app_id'
import EntityManager from '#database/active-records/staff_member'
import { DateTime } from 'luxon'
import { EmploymentType } from '#kernel/staff/domain/type/employment_type'
import { StaffRoleType } from '#kernel/staff/domain/type/staff_role_type'
import { StaffStatusType } from '#kernel/staff/domain/type/staff_status_type'
import { EmergencyContactType } from '#kernel/staff/domain/type/emergency_contact_type'

export class StaffMemberARRepository implements StaffMemberRepository {
  async findById(id: AppId): Promise<StaffMember> {
    const staffMember = await EntityManager.findOrFail(id.value)

    return this.toDomainEntity(staffMember)
  }

  async findAll(): Promise<StaffMember[]> {
    const staffMembers = await EntityManager.query()

    return staffMembers.map((sm) => this.toDomainEntity(sm))
  }

  async findByUserId(userId: AppId): Promise<StaffMember | null> {
    const staffMember = await EntityManager.query().where('user_id', userId.value).first()

    if (!staffMember) {
      return null
    }

    return this.toDomainEntity(staffMember)
  }

  async findByEmail(email: string): Promise<StaffMember | null> {
    const staffMember = await EntityManager.query().where('email', email).first()

    if (!staffMember) {
      return null
    }

    return this.toDomainEntity(staffMember)
  }

  async save(entity: StaffMember): Promise<void> {
    const object = {
      userId: entity.getUserId()?.value ?? null,
      fullName: entity.getFullName(),
      email: entity.getEmail(),
      phone: entity.getPhone(),
      emergencyContact: entity.getEmergencyContact(),
      jobTitle: entity.getJobTitle(),
      department: entity.getDepartment(),
      employmentType: entity.getEmploymentType(),
      role: entity.getRole(),
      status: entity.getStatus(),
      profileImageId: entity.getProfileImageId()?.value ?? null,
      profileImageUrl: entity.getProfileImageUrl(),
    }

    if (entity.getId()) {
      await EntityManager.updateOrCreate({ id: entity.getId()!.value as any }, object as any)
    } else {
      const created = await EntityManager.create(object as any)
      entity.setId(AppId.fromString(created.id))
    }
  }

  async delete(id: AppId): Promise<void> {
    const staffMember = await EntityManager.findOrFail(id.value)
    await staffMember.delete()
  }

  private toDomainEntity(staffMember: any): StaffMember {
    return new StaffMember(
      AppId.fromString(staffMember.id),
      staffMember.userId ? AppId.fromString(staffMember.userId) : null,
      staffMember.fullName,
      staffMember.email,
      staffMember.phone,
      staffMember.emergencyContact as EmergencyContactType | null,
      staffMember.jobTitle,
      staffMember.department,
      staffMember.employmentType as EmploymentType,
      staffMember.role as StaffRoleType,
      staffMember.status as StaffStatusType,
      staffMember.profileImageId ? AppId.fromString(staffMember.profileImageId) : null,
      staffMember.profileImageUrl,
      this.toDate(staffMember.createdAt),
      this.toDate(staffMember.updatedAt)
    )
  }

  private toDate(dateTime: DateTime | null | undefined): Date | undefined {
    if (!dateTime) return undefined
    return dateTime.toJSDate()
  }
}
