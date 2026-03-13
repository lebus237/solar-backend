import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CustomerRepository } from '#kernel/customer/domain/repository/customer_repository'
import { UpdateCustomerCommand } from '#kernel/customer/application/command/update_customer_command'
import { AppId } from '#shared/domain/app_id'
import { CustomerNotFoundError } from '#kernel/customer/domain/errors/customer_not_found_error'

export class UpdateCustomerHandler implements CommandHandler<UpdateCustomerCommand, string> {
  constructor(private customerRepository: CustomerRepository) {}

  async handle(command: UpdateCustomerCommand): Promise<string> {
    const customerId = AppId.fromString(command.id)
    const customer = await this.customerRepository.findById(customerId)

    if (!customer) {
      throw new CustomerNotFoundError(command.id)
    }

    customer.setFirstName(command.firstName)
    customer.setLastName(command.lastName)
    customer.setEmail(command.email)
    customer.setPhone(command.phone)

    await this.customerRepository.save(customer)

    return customer.getId()!.value
  }
}
