import { StaffRoleType } from '#kernel/staff/domain/type/staff_role_type'
import { EmploymentType } from '#kernel/staff/domain/type/employment_type'
import { StaffStatusType } from '#kernel/staff/domain/type/staff_status_type'
import { EmergencyContactType } from '#kernel/staff/domain/type/emergency_contact_type'

export interface StaffMemberListItemDto {
  id: string
  fullName: string
  email: string
  phone: string | null
  jobTitle: string
  department: string | null
  role: StaffRoleType
  status: StaffStatusType
  profileImageUrl: string | null
  createdAt: unknown
  updatedAt: unknown
}

export interface StaffMemberDetailsDto {
  id: string
  userId: string | null
  fullName: string
  email: string
  phone: string | null
  emergencyContact: EmergencyContactType | null
  jobTitle: string
  department: string | null
  employmentType: EmploymentType
  role: StaffRoleType
  status: StaffStatusType
  profileImageId: string | null
  profileImageUrl: string | null
  createdAt: unknown
  updatedAt: unknown
}
