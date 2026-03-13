import { QueryHandler } from '#shared/application/use-cases/query_handler'
import { ListCustomerAddressesQuery } from '#kernel/customer/application/query/list_customer_addresses_query'
import { Address } from '#kernel/customer/domain/entity/address'
import type { AddressRepository } from '#kernel/customer/domain/repository/address_repository'
import { AppId } from '#shared/domain/app_id'

export interface AddressDTO {
  id: string | null
  customerId: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string | null
  postalCode: string | null
  country: string
  type: string
  isDefault: boolean
  createdAt: Date | undefined
  updatedAt: Date | undefined
}

export class ListCustomerAddressesHandler implements QueryHandler<
  ListCustomerAddressesQuery,
  AddressDTO[]
> {
  constructor(private addressRepository: AddressRepository) {}

  async handle(query: ListCustomerAddressesQuery): Promise<AddressDTO[]> {
    const addresses = await this.addressRepository.findByCustomerId(
      AppId.fromString(query.customerId)
    )

    return addresses.map((address: Address) => ({
      id: address.getId()?.value ?? null,
      customerId: address.getCustomerId().value,
      addressLine1: address.getAddressLine1(),
      addressLine2: address.getAddressLine2(),
      city: address.getCity(),
      state: address.getState(),
      postalCode: address.getPostalCode(),
      country: address.getCountry(),
      type: address.getType(),
      isDefault: address.getIsDefault(),
      createdAt: address.getCreatedAt(),
      updatedAt: address.getUpdatedAt(),
    }))
  }
}
