import { CommandBus } from '#shared/infrastructure/bus/command_bus'
import { QueryBus } from '#shared/infrastructure/bus/query_bus'
import { ApplicationService } from '@adonisjs/core/types'
import { UpdateStoreHandler } from '#kernel/store/application/command_handler/update_store_handler'
import { CreateStoreHandler } from '#kernel/store/application/command_handler/create_store_handler'
import { CreateProductHandler } from '#kernel/product/application/command-handler/create_product_handler'
import { UpdateProductHandler } from '#kernel/product/application/command-handler/update_product_handler'
import { CreateProductCategoryHandler } from '#kernel/product/application/command-handler/create_product_category_handler'
import { UpdateProductCategoryHandler } from '#kernel/product/application/command-handler/update_product_category_handler'
import { StoreImageHandler } from '#kernel/medias/application/command_handler/store_image.handler'
import { DeleteImageHandler } from '#kernel/medias/application/command_handler/delete_image_handler'
import { CreateMarketServiceHandler } from '#kernel/market/application/command_handler/create_market_service_handler'
import { UpdateMarketServiceHandler } from '#kernel/market/application/command_handler/update_market_service_handler'
import { UpdateMarketServiceDescriptionHandler } from '#kernel/market/application/command_handler/update_market_service_description.handler'
import { DeleteMarketServiceHandler } from '#kernel/market/application/command_handler/delete_market_service_handler'
import { AddStockHandler } from '#kernel/product/application/command-handler/add_stock_handler'
import { RemoveStockHandler } from '#kernel/product/application/command-handler/remove_stock_handler'
import { SetStockHandler } from '#kernel/product/application/command-handler/set_stock_handler'
import { CreateCustomerHandler } from '#kernel/customer/application/command-handler/create_customer_handler'
import { CreateAddressHandler } from '#kernel/customer/application/command-handler/create_address_handler'
import { CreateOrderHandler } from '#kernel/order/application/command-handler/create_order_handler'
import { UpdateOrderStatusHandler } from '#kernel/order/application/command-handler/update_order_status_handler'
import { CancelOrderHandler } from '#kernel/order/application/command-handler/cancel_order_handler'
import { ListCustomersHandler } from '#kernel/customer/application/query-handler/list_customers_handler'
import { GetCustomerHandler } from '#kernel/customer/application/query-handler/get_customer_handler'
import { ListCustomerAddressesHandler } from '#kernel/customer/application/query-handler/list_customer_addresses_handler'
import { UpdateCustomerHandler } from '#kernel/customer/application/command-handler/update_customer_handler'

export default class CqrsProvider {
  constructor(protected app: ApplicationService) {}

  public register() {
    this.app.container.singleton('CQRS/CommandBus', async () => {
      const commandBus = new CommandBus(this.app)

      //PRODUCT COMMANDS
      commandBus.register('CreateStoreCommand', CreateStoreHandler, ['StoreRepository'])
      commandBus.register('UpdateStoreCommand', UpdateStoreHandler, ['StoreRepository'])
      commandBus.register('CreateProductCommand', CreateProductHandler, ['ProductRepository'])
      commandBus.register('UpdateProductCommand', UpdateProductHandler, ['ProductRepository'])
      commandBus.register('CreateProductCategoryCommand', CreateProductCategoryHandler, [
        'ProductCategoryRepository',
      ])
      commandBus.register('UpdateProductCategoryCommand', UpdateProductCategoryHandler, [
        'ProductCategoryRepository',
      ])

      //MARKET SERVICES COMMAND
      commandBus.register('CreateMarketServiceCommand', CreateMarketServiceHandler, [
        'MarketServiceRepository',
      ])
      commandBus.register('UpdateMarketServiceCommand', UpdateMarketServiceHandler, [
        'MarketServiceRepository',
      ])
      commandBus.register(
        'UpdateMarketServiceDescriptionCommand',
        UpdateMarketServiceDescriptionHandler,
        ['MarketServiceRepository']
      )
      commandBus.register('DeleteMarketServiceCommand', DeleteMarketServiceHandler, [
        'MarketServiceRepository',
      ])

      //MEDIA COMMANDS
      commandBus.register('StoreImageCommand', StoreImageHandler, [
        'ImageMediaRepository',
        'MediaUploadService',
      ])
      commandBus.register('DeleteImageCommand', DeleteImageHandler, [
        'ImageMediaRepository',
        'MediaUploadService',
      ])

      //STOCK COMMANDS
      commandBus.register('AddStockCommand', AddStockHandler, [
        'ProductRepository',
        'StockMovementRepository',
      ])
      commandBus.register('RemoveStockCommand', RemoveStockHandler, [
        'ProductRepository',
        'StockMovementRepository',
      ])
      commandBus.register('SetStockCommand', SetStockHandler, [
        'ProductRepository',
        'StockMovementRepository',
      ])

      //CUSTOMER COMMANDS
      commandBus.register('CreateCustomerCommand', CreateCustomerHandler, ['CustomerRepository'])
      commandBus.register('UpdateCustomerCommand', UpdateCustomerHandler, ['CustomerRepository'])
      commandBus.register('CreateAddressCommand', CreateAddressHandler, [
        'CustomerRepository',
        'AddressRepository',
      ])

      //ORDER COMMANDS
      commandBus.register('CreateOrderCommand', CreateOrderHandler, [
        'OrderRepository',
        'CustomerRepository',
        'AddressRepository',
        'ProductRepository',
      ])
      commandBus.register('UpdateOrderStatusCommand', UpdateOrderStatusHandler, ['OrderRepository'])
      commandBus.register('CancelOrderCommand', CancelOrderHandler, ['OrderRepository'])

      return commandBus
    })

    this.app.container.singleton('CQRS/QueryBus', async () => {
      const queryBus = new QueryBus()

      //CUSTOMER QUERIES
      const customerRepository = await this.app.container.make('CustomerRepository')
      const addressRepository = await this.app.container.make('AddressRepository')

      queryBus.register('ListCustomersQuery', new ListCustomersHandler(customerRepository))
      queryBus.register('GetCustomerQuery', new GetCustomerHandler(customerRepository))
      queryBus.register(
        'ListCustomerAddressesQuery',
        new ListCustomerAddressesHandler(addressRepository)
      )

      return queryBus
    })
  }

  public async boot() {}
  public async ready() {}
  public async shutdown() {}
}
