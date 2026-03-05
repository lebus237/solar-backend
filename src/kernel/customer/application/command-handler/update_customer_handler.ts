import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CustomerRepository } from '#kernel/customer/domain/repository/customer_repository'
import { UpdateCustomerCommand } from '../command/update_customer_command'

export class UpdateCustomerHandler implements CommandHandler<UpdateCustomerCommand, string> {
  constructor(private customerRepository: CustomerRepository) {}

  async handle(command: UpdateCustomerCommand): Promise<string> {
    const customer = await this.customerRepository.findById(command.id)

    if (!customer) {
      throw new Error('Customer not found')
    }

    customer.setFirstName(command.firstName)
    customer.setLastName(command.lastName)
    customer.setEmail(command.email)
    customer.setPhone(command.phone)

    await this.customerRepository.save(customer)

    return customer.getId() as string
  }
}
