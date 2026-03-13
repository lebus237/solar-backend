import { CommandHandler } from '#shared/application/use-cases/command_handler'
import { CreateAddressCommand } from '#kernel/customer/application/command/create_address_command'
import { CustomerRepository } from '#kernel/customer/domain/repository/customer_repository'
import { AddressRepository } from '#kernel/customer/domain/repository/address_repository'
import { Address } from '#kernel/customer/domain/entity/address'
import { AppId } from '#shared/domain/app_id'

export class CreateAddressHandler implements CommandHandler<CreateAddressCommand, string> {
  constructor(
    private customerRepository: CustomerRepository,
    private addressRepository: AddressRepository
  ) {}

  async handle(command: CreateAddressCommand): Promise<string> {
    // Verify customer exists
    await this.customerRepository.findById(AppId.fromString(command.customerId))

    const address = new Address(
      null,
      AppId.fromString(command.customerId),
      command.type,
      command.addressLine1,
      command.addressLine2,
      command.city,
      command.state,
      command.postalCode,
      command.country,
      command.isDefault
    )

    await this.addressRepository.save(address)

    return address.getId()!.value
  }
}
