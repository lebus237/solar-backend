import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CreateCustomerCommand } from '#kernel/customer/application/command/create_customer_command'
import { CustomerRepository } from '#kernel/customer/domain/repository/customer_repository'
import { Customer } from '#kernel/customer/domain/entity/customer'
import { AppId } from '#shared/domain/app_id'

export class CreateCustomerHandler implements CommandHandler<CreateCustomerCommand, string> {
  constructor(private customerRepository: CustomerRepository) {}

  async handle(command: CreateCustomerCommand): Promise<string> {
    const customer = new Customer(
      null,
      command.userId ? AppId.fromString(command.userId) : null,
      command.firstName,
      command.lastName,
      command.phone,
      command.email
    )

    await this.customerRepository.save(customer)

    return customer.getId()!.value
  }
}
