import { AddressRepository } from '#kernel/customer/domain/repository/address_repository'
import { default as EntityActiveRecord } from '#database/active-records/address'
import { Address } from '#kernel/customer/domain/entity/address'
import { AddressType } from '#kernel/customer/domain/type/address_type'
import {
  AddressId,
  CustomerId,
  asAddressId,
  asCustomerId,
} from '#shared/domain/types/branded_types'
import { DateTime } from 'luxon'

export class AddressARRepository implements AddressRepository {
  async findById(id: AddressId): Promise<Address> {
    const address = await EntityActiveRecord.findOrFail(id)

    return new Address(
      asAddressId(address.id),
      asCustomerId(address.customerId),
      address.type as AddressType,
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.postalCode,
      address.country,
      address.isDefault,
      this.toDate(address.createdAt),
      this.toDate(address.updatedAt)
    )
  }

  async findByCustomerId(customerId: CustomerId): Promise<Address[]> {
    const addresses = await EntityActiveRecord.query().where('customer_id', customerId)

    return addresses.map((addr) => {
      return new Address(
        asAddressId(addr.id),
        asCustomerId(addr.customerId),
        addr.type as AddressType,
        addr.addressLine1,
        addr.addressLine2,
        addr.city,
        addr.state,
        addr.postalCode,
        addr.country,
        addr.isDefault,
        this.toDate(addr.createdAt),
        this.toDate(addr.updatedAt)
      )
    })
  }

  async save(entity: Address): Promise<void> {
    const object = {
      customerId: entity.getCustomerId() as any,
      type: entity.getType(),
      addressLine1: entity.getAddressLine1(),
      addressLine2: entity.getAddressLine2(),
      city: entity.getCity(),
      state: entity.getState(),
      postalCode: entity.getPostalCode(),
      country: entity.getCountry(),
      isDefault: entity.getIsDefault(),
    }

    if (entity.getId()) {
      await EntityActiveRecord.updateOrCreate({ id: entity.getId() as any }, object as any)
    } else {
      await EntityActiveRecord.create(object as any)
    }
  }

  async delete(id: AddressId): Promise<void> {
    const address = await EntityActiveRecord.findOrFail(id)
    await address.delete()
  }

  private toDate(dateTime: DateTime | null | undefined): Date | undefined {
    if (!dateTime) return undefined
    return dateTime.toJSDate()
  }
}
