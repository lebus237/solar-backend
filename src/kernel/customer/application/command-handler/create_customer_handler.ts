import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CreateCustomerCommand } from '#kernel/customer/application/command/create_customer_command'
import { CustomerRepository } from '#kernel/customer/domain/repository/customer_repository'
import { Customer } from '#kernel/customer/domain/entity/customer'
import { asUserId } from '#shared/domain/types/branded_types'

export class CreateCustomerHandler implements CommandHandler<CreateCustomerCommand, string> {
  constructor(private customerRepository: CustomerRepository) {}

  async handle(command: CreateCustomerCommand): Promise<string> {
    const customer = new Customer(
      null,
      command.userId ? asUserId(command.userId) : null,
      command.firstName,
      command.lastName,
      command.phone,
      command.email
    )

    await this.customerRepository.save(customer)

    return customer.getId() as string
  }
}
