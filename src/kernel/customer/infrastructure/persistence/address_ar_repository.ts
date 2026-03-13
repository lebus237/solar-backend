import { AddressRepository } from '#kernel/customer/domain/repository/address_repository'
import { default as EntityActiveRecord } from '#database/active-records/address'
import { Address } from '#kernel/customer/domain/entity/address'
import { AddressType } from '#kernel/customer/domain/type/address_type'
import { AppId } from '#shared/domain/app_id'
import { DateTime } from 'luxon'

export class AddressARRepository implements AddressRepository {
  async findById(id: AppId): Promise<Address> {
    const address = await EntityActiveRecord.findOrFail(id.value)

    return new Address(
      AppId.fromString(address.id),
      AppId.fromString(address.customerId),
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

  async findByCustomerId(customerId: AppId): Promise<Address[]> {
    const addresses = await EntityActiveRecord.query().where('customer_id', customerId.value)

    return addresses.map((addr) => {
      return new Address(
        AppId.fromString(addr.id),
        AppId.fromString(addr.customerId),
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
      customerId: entity.getCustomerId().value as any,
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
      await EntityActiveRecord.updateOrCreate({ id: entity.getId()!.value as any }, object as any)
    } else {
      const created = await EntityActiveRecord.create(object as any)
      entity.setId(AppId.fromString(created.id))
    }
  }

  async delete(id: AppId): Promise<void> {
    const address = await EntityActiveRecord.findOrFail(id.value)
    await address.delete()
  }

  private toDate(dateTime: DateTime | null | undefined): Date | undefined {
    if (!dateTime) return undefined
    return dateTime.toJSDate()
  }
}
