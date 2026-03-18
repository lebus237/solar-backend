import { AppId } from '#shared/domain/app_id'
import { StaffRoleType } from '#kernel/staff/domain/type/staff_role_type'
import { EmploymentType } from '#kernel/staff/domain/type/employment_type'
import { StaffStatusType } from '#kernel/staff/domain/type/staff_status_type'
import { EmergencyContactType } from '#kernel/staff/domain/type/emergency_contact_type'

export class StaffMember {
  constructor(
    private id: AppId | null,
    private userId: AppId | null,
    private fullName: string,
    private email: string,
    private phone: string | null,
    private emergencyContact: EmergencyContactType | null,
    private jobTitle: string,
    private department: string | null,
    private employmentType: EmploymentType,
    private role: StaffRoleType,
    private status: StaffStatusType,
    private profileImageId: AppId | null,
    private profileImageUrl: string | null,
    private createdAt?: Date,
    private updatedAt?: Date
  ) {}

  getId(): AppId | null {
    return this.id
  }

  setId(id: AppId): void {
    this.id = id
  }

  getUserId(): AppId | null {
    return this.userId
  }

  getFullName(): string {
    return this.fullName
  }

  getEmail(): string {
    return this.email
  }

  getPhone(): string | null {
    return this.phone
  }

  getEmergencyContact(): EmergencyContactType | null {
    return this.emergencyContact
  }

  getJobTitle(): string {
    return this.jobTitle
  }

  getDepartment(): string | null {
    return this.department
  }

  getEmploymentType(): EmploymentType {
    return this.employmentType
  }

  getRole(): StaffRoleType {
    return this.role
  }

  getStatus(): StaffStatusType {
    return this.status
  }

  getProfileImageId(): AppId | null {
    return this.profileImageId
  }

  getProfileImageUrl(): string | null {
    return this.profileImageUrl
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt
  }

  // Setters
  setFullName(fullName: string): void {
    this.fullName = fullName
  }

  setEmail(email: string): void {
    this.email = email
  }

  setPhone(phone: string | null): void {
    this.phone = phone
  }

  setEmergencyContact(emergencyContact: EmergencyContactType | null): void {
    this.emergencyContact = emergencyContact
  }

  setJobTitle(jobTitle: string): void {
    this.jobTitle = jobTitle
  }

  setDepartment(department: string | null): void {
    this.department = department
  }

  setEmploymentType(employmentType: EmploymentType): void {
    this.employmentType = employmentType
  }

  setRole(role: StaffRoleType): void {
    this.role = role
  }

  setStatus(status: StaffStatusType): void {
    this.status = status
  }

  setProfileImageId(profileImageId: AppId | null): void {
    this.profileImageId = profileImageId
  }

  setProfileImageUrl(profileImageUrl: string | null): void {
    this.profileImageUrl = profileImageUrl
  }
}
