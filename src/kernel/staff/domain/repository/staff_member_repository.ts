import { RepositoryInterface } from '#shared/infrastructure/repository_interface'
import { StaffMember } from '#kernel/staff/domain/entity/staff_member'
import { AppId } from '#shared/domain/app_id'

export interface StaffMemberRepository extends RepositoryInterface {
  save(entity: StaffMember): Promise<void>
  findById(id: AppId): Promise<StaffMember>
  findAll(): Promise<StaffMember[]>
  findByUserId(userId: AppId): Promise<StaffMember | null>
  findByEmail(email: string): Promise<StaffMember | null>
  delete(id: AppId): Promise<void>
}
