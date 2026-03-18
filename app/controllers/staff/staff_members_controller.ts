import type { HttpContext } from '@adonisjs/core/http'
import {
  createStaffMemberSchema,
  updateStaffMemberSchema,
} from '#validators/staff_member_validator'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { CreateStaffMemberCommand } from '#kernel/staff/application/command/create_staff_member_command'
import { UpdateStaffMemberCommand } from '#kernel/staff/application/command/update_staff_member_command'
import { DeleteStaffMemberCommand } from '#kernel/staff/application/command/delete_staff_member_command'
import { ListStaffMembersQuery } from '#kernel/staff/application/query/list_staff_members_query'
import { GetStaffMemberQuery } from '#kernel/staff/application/query/get_staff_member_query'
import { PaginatedResultDto } from '#shared/application/collection/paginated_result'
import {
  StaffMemberListItemDto,
  StaffMemberDetailsDto,
} from '#kernel/staff/application/dto/staff_member_read_dto'

export default class StaffMembersController extends AppAbstractController {
  constructor() {
    super()
  }

  /**
   * Display a list of staff members
   */
  async index({ request, response }: HttpContext) {
    const query = request.qs()
    const result = await this.handleQuery<PaginatedResultDto<StaffMemberListItemDto>>(
      new ListStaffMembersQuery(
        this.parseQueryPagination(query),
        this.parseQuerySearch(query),
        this.parseQuerySort(query)
      )
    )

    return response.ok(result)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createStaffMemberSchema)

    await this.handleCommand(
      new CreateStaffMemberCommand(
        payload.userId ?? null,
        payload.fullName,
        payload.email,
        payload.phone ?? null,
        payload.emergencyContact ?? null,
        payload.jobTitle,
        payload.department ?? null,
        payload.employmentType,
        payload.role,
        payload.profileImageId ?? null,
        payload.profileImageUrl ?? null
      )
    )

    return response.created()
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const staffMember = await this.handleQuery<StaffMemberDetailsDto>(
      new GetStaffMemberQuery(params.id)
    )

    return response.ok({ data: staffMember })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateStaffMemberSchema)

    await this.handleCommand(
      new UpdateStaffMemberCommand(
        params.id,
        payload.fullName,
        payload.email,
        payload.phone ?? null,
        payload.emergencyContact ?? null,
        payload.jobTitle,
        payload.department ?? null,
        payload.employmentType,
        payload.role,
        payload.status,
        payload.profileImageId ?? null,
        payload.profileImageUrl ?? null
      )
    )

    return response.noContent()
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    await this.handleCommand(new DeleteStaffMemberCommand(params.id))

    return response.noContent()
  }
}
