import { HttpContext } from '@adonisjs/core/http'
import { AppAbstractController } from '#shared/user_interface/controller/app_abstract_controller'
import { CreateCustomerCommand } from '#kernel/customer/application/command/create_customer_command'
import { CreateAddressCommand } from '#kernel/customer/application/command/create_address_command'
import { AddressType } from '#kernel/customer/domain/type/address_type'
import {
  createCustomerSchema,
  updateCustomerSchema,
  createAddressSchema,
} from '#validators/customer_validator'
import { ListCustomersQuery } from '#kernel/customer/application/query/list_customers_query'
import { GetCustomerQuery } from '#kernel/customer/application/query/get_customer_query'
import { ListCustomerAddressesQuery } from '#kernel/customer/application/query/list_customer_addresses_query'
import { UpdateCustomerCommand } from '#kernel/customer/application/command/update_customer_command'

export default class CustomerController extends AppAbstractController {
  constructor() {
    super()
  }

  /**
   * List all customers
   */
  async index({ response }: HttpContext) {
    const customers = await this.handleQuery(new ListCustomersQuery())

    return response.ok({
      status: 'success',
      data: customers,
    })
  }

  /**
   * Get a single customer by ID
   */
  async show({ params, response }: HttpContext) {
    const customer = await this.handleQuery(new GetCustomerQuery(params.id))

    return response.ok({
      status: 'success',
      data: customer,
    })
  }

  /**
   * Create a new customer
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createCustomerSchema)

    await this.handleCommand(
      new CreateCustomerCommand(
        payload.firstName,
        payload.lastName,
        payload.phone,
        payload.email,
        payload.userId
      )
    )

    return response.created()
  }

  /**
   * Update a customer
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateCustomerSchema)

    await this.handleCommand(
      new UpdateCustomerCommand(
        params.id,
        payload.firstName,
        payload.lastName,
        payload.phone,
        payload.email
      )
    )

    return response.noContent()
  }

  /**
   * Get customer addresses
   */
  async addresses({ params, response }: HttpContext) {
    const addresses = await this.handleQuery(new ListCustomerAddressesQuery(params.customerId))

    return response.ok({
      data: addresses,
    })
  }

  /**
   * Add address to customer
   */
  async addAddress({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(createAddressSchema)

    await this.handleCommand(
      new CreateAddressCommand(
        params.customerId,
        payload.addressLine1,
        payload.addressLine2 || null,
        payload.city,
        payload.state,
        payload.postalCode,
        payload.country,
        payload.type as AddressType,
        payload.isDefault || false
      )
    )

    return response.created()
  }

  /**
   * Update an address
   */
  // async updateAddress({ params, request, response }: HttpContext) {
  //   const payload = await request.validateUsing(updateAddressSchema)

  //   const addressRepository = (await this.getService('AddressRepository')) as AddressRepository
  //   const address = await addressRepository.findById(params.addressId)

  //   if (payload.addressLine1) address.setAddressLine1(payload.addressLine1)
  //   if (payload.addressLine2 !== undefined) address.setAddressLine2(payload.addressLine2)
  //   if (payload.city) address.setCity(payload.city)
  //   if (payload.state) address.setState(payload.state)
  //   if (payload.postalCode) address.setPostalCode(payload.postalCode)
  //   if (payload.country) address.setCountry(payload.country)
  //   if (payload.type) address.setType(payload.type as AddressType)
  //   if (payload.isDefault !== undefined) address.setDefault(payload.isDefault)

  //   await addressRepository.save(address)

  //   return response.ok({
  //     status: 'success',
  //     message: 'Address updated successfully',
  //     data: {
  //       id: address.getId(),
  //       customerId: address.getCustomerId(),
  //       addressLine1: address.getAddressLine1(),
  //       addressLine2: address.getAddressLine2(),
  //       city: address.getCity(),
  //       state: address.getState(),
  //       postalCode: address.getPostalCode(),
  //       country: address.getCountry(),
  //       type: address.getType(),
  //       isDefault: address.getIsDefault(),
  //       createdAt: address.getCreatedAt(),
  //       updatedAt: address.getUpdatedAt(),
  //     },
  //   })
  // }

  // /**
  //  * Delete an address
  //  */
  // async deleteAddress({ params, response }: HttpContext) {
  //   const addressRepository = (await this.getService('AddressRepository')) as AddressRepository
  //   await addressRepository.delete(params.addressId)

  //   return response.ok({
  //     status: 'success',
  //     message: 'Address deleted successfully',
  //   })
  // }
}
