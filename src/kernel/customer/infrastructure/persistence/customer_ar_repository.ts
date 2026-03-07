import { CustomerRepository } from '#kernel/customer/domain/repository/customer_repository'
import { default as EntityActiveRecord } from '#database/active-records/customer'
import { Customer } from '#kernel/customer/domain/entity/customer'
import { Address } from '#kernel/customer/domain/entity/address'
import { AddressType } from '#kernel/customer/domain/type/address_type'

export class CustomerARRepository implements CustomerRepository {
  async findById(id: string): Promise<Customer> {
    const customer = await EntityActiveRecord.query()
      .where('id', id)
      .preload('addresses')
      .firstOrFail()

    const addresses = (customer.addresses || []).map((addr) => {
      return new Address(
        addr.id,
        addr.customerId,
        addr.type as AddressType,
        addr.addressLine1,
        addr.addressLine2,
        addr.city,
        addr.state,
        addr.postalCode,
        addr.country,
        addr.isDefault,
        addr.createdAt as any,
        addr.updatedAt as any
      )
    })

    return new Customer(
      customer.id,
      customer.userId,
      customer.firstName,
      customer.lastName,
      customer.phone,
      customer.email as string,
      addresses,
      customer.createdAt as any,
      customer.updatedAt as any
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
        addr.id,
        addr.customerId,
        addr.type as AddressType,
        addr.addressLine1,
        addr.addressLine2,
        addr.city,
        addr.state,
        addr.postalCode,
        addr.country,
        addr.isDefault,
        addr.createdAt as any,
        addr.updatedAt as any
      )
    })

    return new Customer(
      customer.id,
      customer.userId,
      customer.firstName,
      customer.lastName,
      customer.phone,
      customer.email as string,
      addresses,
      customer.createdAt as any,
      customer.updatedAt as any
    )
  }

  async save(entity: Customer): Promise<void> {
    const object = {
      userId: entity.getUserId() as any,
      firstName: entity.getFirstName(),
      lastName: entity.getLastName(),
      email: entity.getEmail(),
      phone: entity.getPhone(),
    }

    if (entity.getId()) {
      await EntityActiveRecord.updateOrCreate({ id: entity.getId() as any }, object)
    } else {
      await EntityActiveRecord.create(object)
    }
  }

  async delete(id: string): Promise<void> {
    const customer = await EntityActiveRecord.findOrFail(id)
    await customer.delete()
  }

  async findAll(): Promise<Customer[]> {
    const customers = await EntityActiveRecord.query().preload('addresses')

    return customers.map((customer) => {
      const addresses = (customer.addresses || []).map((addr) => {
        return new Address(
          addr.id,
          addr.customerId,
          addr.type as AddressType,
          addr.addressLine1,
          addr.addressLine2,
          addr.city,
          addr.state,
          addr.postalCode,
          addr.country,
          addr.isDefault,
          addr.createdAt as any,
          addr.updatedAt as any
        )
      })

      return new Customer(
        customer.id,
        customer.userId,
        customer.firstName,
        customer.lastName,
        customer.phone,
        customer.email as string,
        addresses,
        customer.createdAt as any,
        customer.updatedAt as any
      )
    })
  }
}
