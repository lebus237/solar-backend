import { CustomerRepository } from '#kernel/customer/domain/repository/customer_repository'
import { default as EntityActiveRecord } from '#database/active-records/customer'
import { Customer } from '#kernel/customer/domain/entity/customer'
import { Address } from '#kernel/customer/domain/entity/address'
import { AddressType } from '#kernel/customer/domain/type/address_type'
import { CustomerId, asCustomerId, asUserId, asAddressId } from '#shared/domain/types/branded_types'
import { DateTime } from 'luxon'

export class CustomerARRepository implements CustomerRepository {
  async findById(id: CustomerId): Promise<Customer> {
    const customer = await EntityActiveRecord.query()
      .where('id', id)
      .preload('addresses')
      .firstOrFail()

    const addresses = (customer.addresses || []).map((addr) => {
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

    return new Customer(
      asCustomerId(customer.id),
      customer.userId ? asUserId(customer.userId) : null,
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

    return new Customer(
      asCustomerId(customer.id),
      customer.userId ? asUserId(customer.userId) : null,
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
      userId: entity.getUserId() as string | null,
      firstName: entity.getFirstName(),
      lastName: entity.getLastName(),
      email: entity.getEmail(),
      phone: entity.getPhone(),
    }

    if (entity.getId()) {
      await EntityActiveRecord.updateOrCreate({ id: entity.getId() as any }, object as any)
    } else {
      await EntityActiveRecord.create(object as any)
    }
  }

  async delete(id: CustomerId): Promise<void> {
    const customer = await EntityActiveRecord.findOrFail(id)
    await customer.delete()
  }

  async findAll(): Promise<Customer[]> {
    const customers = await EntityActiveRecord.query().preload('addresses')

    return customers.map((customer) => {
      const addresses = (customer.addresses || []).map((addr) => {
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

      return new Customer(
        asCustomerId(customer.id),
        customer.userId ? asUserId(customer.userId) : null,
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
