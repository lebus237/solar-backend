import { CustomerRepository } from '#kernel/customer/domain/repository/customer_repository'
import { default as EntityActiveRecord } from '#database/active-records/customer'
import { Customer } from '#kernel/customer/domain/entity/customer'
import { Address } from '#kernel/customer/domain/entity/address'
import { AddressType } from '#kernel/customer/domain/type/address_type'
import { AppId } from '#shared/domain/app_id'
import { DateTime } from 'luxon'

export class CustomerARRepository implements CustomerRepository {
  async findById(id: AppId): Promise<Customer> {
    const customer = await EntityActiveRecord.query()
      .where('id', id.value)
      .preload('addresses')
      .firstOrFail()

    const addresses = (customer.addresses || []).map((addr) => {
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

    return new Customer(
      AppId.fromString(customer.id),
      customer.userId ? AppId.fromString(customer.userId) : null,
      customer.firstName,
      customer.lastName,
      customer.phone,
      customer.email ?? undefined,
      addresses,
      this.toDate(customer.createdAt),
      this.toDate(customer.updatedAt)
    )
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await EntityActiveRecord.query()
      .where('email', email)
      .preload('addresses')
      .first()
    if (!customer) {
      return null
    }

    const addresses = (customer.addresses || []).map((addr) => {
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

    return new Customer(
      AppId.fromString(customer.id),
      customer.userId ? AppId.fromString(customer.userId) : null,
      customer.firstName,
      customer.lastName,
      customer.phone,
      customer.email ?? undefined,
      addresses,
      this.toDate(customer.createdAt),
      this.toDate(customer.updatedAt)
    )
  }

  async save(entity: Customer): Promise<void> {
    const object = {
      userId: entity.getUserId()?.value ?? null,
      firstName: entity.getFirstName(),
      lastName: entity.getLastName(),
      email: entity.getEmail(),
      phone: entity.getPhone(),
    }

    if (entity.getId()) {
      await EntityActiveRecord.updateOrCreate({ id: entity.getId()!.value as any }, object as any)
    } else {
      const created = await EntityActiveRecord.create(object as any)
      entity.setId(AppId.fromString(created.id))
    }
  }

  async delete(id: AppId): Promise<void> {
    const customer = await EntityActiveRecord.findOrFail(id.value)
    await customer.delete()
  }

  async findAll(): Promise<Customer[]> {
    const customers = await EntityActiveRecord.query().preload('addresses')

    return customers.map((customer) => {
      const addresses = (customer.addresses || []).map((addr) => {
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

      return new Customer(
        AppId.fromString(customer.id),
        customer.userId ? AppId.fromString(customer.userId) : null,
        customer.firstName,
        customer.lastName,
        customer.phone,
        customer.email ?? undefined,
        addresses,
        this.toDate(customer.createdAt),
        this.toDate(customer.updatedAt)
      )
    })
  }

  private toDate(dateTime: DateTime | null | undefined): Date | undefined {
    if (!dateTime) return undefined
    return dateTime.toJSDate()
  }
}
