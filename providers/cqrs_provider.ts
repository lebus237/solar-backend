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
import { ReplaceMarketServiceThumbnailHandler } from '#kernel/market/application/command_handler/replace_market_service_thumbnail_handler'
import { UpdateMarketServiceDescriptionHandler } from '#kernel/market/application/command_handler/update_market_service_description.handler'
import { DeleteMarketServiceHandler } from '#kernel/market/application/command_handler/delete_market_service_handler'
import { AddStockHandler } from '#kernel/product/application/command-handler/add_stock_handler'
import { RemoveStockHandler } from '#kernel/product/application/command-handler/remove_stock_handler'
import { SetStockHandler } from '#kernel/product/application/command-handler/set_stock_handler'
import { AddProductImageHandler } from '#kernel/product/application/command-handler/add_product_image_handler'
import { RemoveProductImageHandler } from '#kernel/product/application/command-handler/remove_product_image_handler'
import { CreateCustomerHandler } from '#kernel/customer/application/command-handler/create_customer_handler'
import { CreateAddressHandler } from '#kernel/customer/application/command-handler/create_address_handler'
import { CreateOrderHandler } from '#kernel/order/application/command-handler/create_order_handler'
import { UpdateOrderStatusHandler } from '#kernel/order/application/command-handler/update_order_status_handler'
import { CancelOrderHandler } from '#kernel/order/application/command-handler/cancel_order_handler'
import { ListCustomersHandler } from '#kernel/customer/application/query-handler/list_customers_handler'
import { GetCustomerHandler } from '#kernel/customer/application/query-handler/get_customer_handler'
import { ListCustomerAddressesHandler } from '#kernel/customer/application/query-handler/list_customer_addresses_handler'
import { UpdateCustomerHandler } from '#kernel/customer/application/command-handler/update_customer_handler'
import { GetProductHandler } from '#kernel/product/application/query-handler/get_product_handler'
import { ListProductsHandler } from '#kernel/product/application/query-handler/list_products_handler'
import { ListProductsGroupedByCategoryHandler } from '#kernel/product/application/query-handler/list_products_grouped_by_category_handler'
import { ListProductCategoriesHandler } from '#kernel/product/application/query-handler/list_product_categories_handler'
import { ListProductsByCategoryHandler } from '#kernel/product/application/query-handler/list_products_by_category_handler'
import { GetProductCategoryHandler } from '#kernel/product/application/query-handler/get_product_category_handler'
import { GetProductStockHandler } from '#kernel/product/application/query-handler/get_product_stock_handler'
import { GetStockHistoryHandler } from '#kernel/product/application/query-handler/get_stock_history_handler'
import { ListLowStockProductsHandler } from '#kernel/product/application/query-handler/list_low_stock_products_handler'
import { CreateProductPackHandler } from '#kernel/product/application/command-handler/create_product_pack_handler'
import { UpdateProductPackHandler } from '#kernel/product/application/command-handler/update_product_pack_handler'
import { DeleteProductPackHandler } from '#kernel/product/application/command-handler/delete_product_pack_handler'
import { SetProductPackStockHandler } from '#kernel/product/application/command-handler/set_product_pack_stock_handler'
import { GetProductPackHandler } from '#kernel/product/application/query-handler/get_product_pack_handler'
import { ListProductPacksHandler } from '#kernel/product/application/query-handler/list_product_packs_handler'
import { GetProductPackStockHandler } from '#kernel/product/application/query-handler/get_product_pack_stock_handler'
import { ListOrdersHandler } from '#kernel/order/application/query-handler/list_orders_handler'
import { GetOrderHandler } from '#kernel/order/application/query-handler/get_order_handler'
import { GetOrderByNumberHandler } from '#kernel/order/application/query-handler/get_order_by_number_handler'
import { ListCustomerOrdersHandler } from '#kernel/order/application/query-handler/list_customer_orders_handler'
import { RemoveProductPackItemHandler } from '#kernel/product/application/command-handler/remove_product_pack_item_handler'
import { ListMarketServicesHandler } from '#kernel/market/application/query-handler/list_market_services_handler'
import { GetMarketServiceHandler } from '#kernel/market/application/query-handler/get_market_service_handler'
import { CreateStaffMemberHandler } from '#kernel/staff/application/command-handler/create_staff_member_handler'
import { UpdateStaffMemberHandler } from '#kernel/staff/application/command-handler/update_staff_member_handler'
import { DeleteStaffMemberHandler } from '#kernel/staff/application/command-handler/delete_staff_member_handler'
import { ListStaffMembersHandler } from '#kernel/staff/application/query-handler/list_staff_members_handler'
import { GetStaffMemberHandler } from '#kernel/staff/application/query-handler/get_staff_member_handler'
import { ChangeStoreStatusHandler } from '#kernel/store/application/command_handler/change_store_status_hanler'

export default class CqrsProvider {
  constructor(protected app: ApplicationService) {}

  public register() {
    this.app.container.singleton('CQRS/CommandBus', () => {
      const commandBus = new CommandBus(this.app)

      //STORE COMMANDS
      commandBus.register('CreateStoreCommand', CreateStoreHandler, ['StoreRepository'])
      commandBus.register('UpdateStoreCommand', UpdateStoreHandler, ['StoreRepository'])
      commandBus.register('ChangeStoreStatusCommand', ChangeStoreStatusHandler, ['StoreRepository'])

      //PRODUCT COMMANDS
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
        'ImageMediaRepository',
      ])
      commandBus.register('UpdateMarketServiceCommand', UpdateMarketServiceHandler, [
        'MarketServiceRepository',
      ])
      commandBus.register(
        'ReplaceMarketServiceThumbnailCommand',
        ReplaceMarketServiceThumbnailHandler,
        ['MarketServiceRepository', 'ImageMediaRepository', 'MediaUploadService']
      )
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
      commandBus.register('AddProductImageCommand', AddProductImageHandler, [
        'ProductImageRepository',
      ])
      commandBus.register('RemoveProductImageCommand', RemoveProductImageHandler, [
        'ProductImageRepository',
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

      //PRODUCT PACK COMMANDS
      commandBus.register('CreateProductPackCommand', CreateProductPackHandler, [
        'ProductPackRepository',
      ])
      commandBus.register('UpdateProductPackCommand', UpdateProductPackHandler, [
        'ProductPackRepository',
      ])
      commandBus.register('DeleteProductPackCommand', DeleteProductPackHandler, [
        'ProductPackRepository',
      ])
      commandBus.register('SetProductPackStockCommand', SetProductPackStockHandler, [
        'ProductPackRepository',
      ])
      commandBus.register('RemoveProductPackItemCommand', RemoveProductPackItemHandler, [
        'ProductPackItemRepository',
        'ProductPackRepository',
      ])

      //STAFF MEMBER COMMANDS
      commandBus.register('CreateStaffMemberCommand', CreateStaffMemberHandler, [
        'StaffMemberRepository',
      ])
      commandBus.register('UpdateStaffMemberCommand', UpdateStaffMemberHandler, [
        'StaffMemberRepository',
      ])
      commandBus.register('DeleteStaffMemberCommand', DeleteStaffMemberHandler, [
        'StaffMemberRepository',
      ])

      return commandBus
    })

    this.app.container.singleton('CQRS/QueryBus', () => {
      const queryBus = new QueryBus(this.app)

      //CUSTOMER QUERIES
      queryBus.register('ListCustomersQuery', ListCustomersHandler, ['CustomerRepository'])
      queryBus.register('GetCustomerQuery', GetCustomerHandler, ['CustomerRepository'])
      queryBus.register('ListCustomerAddressesQuery', ListCustomerAddressesHandler, [
        'AddressRepository',
      ])

      //PRODUCT QUERIES
      queryBus.register('ListProductsQuery', ListProductsHandler, ['ProductCollection'])
      queryBus.register('GetProductQuery', GetProductHandler, ['ProductReadModel'])
      queryBus.register(
        'ListProductsGroupedByCategoryQuery',
        ListProductsGroupedByCategoryHandler,
        ['ProductCollection']
      )
      queryBus.register('ListProductCategoriesQuery', ListProductCategoriesHandler, [
        'ProductCategoryCollection',
      ])
      queryBus.register('GetProductCategoryQuery', GetProductCategoryHandler, [
        'ProductCategoryReadModel',
      ])
      queryBus.register('ListProductsByCategoryQuery', ListProductsByCategoryHandler, [
        'ProductCategoryCollection',
      ])
      queryBus.register('GetProductStockQuery', GetProductStockHandler, ['StockReadModel'])
      queryBus.register('GetStockHistoryQuery', GetStockHistoryHandler, ['StockCollection'])
      queryBus.register('ListLowStockProductsQuery', ListLowStockProductsHandler, [
        'StockCollection',
      ])

      //PRODUCT PACK QUERIES
      queryBus.register('GetProductPackQuery', GetProductPackHandler, ['ProductPackReadModel'])
      queryBus.register('ListProductPacksQuery', ListProductPacksHandler, ['ProductPackCollection'])
      queryBus.register('GetProductPackStockQuery', GetProductPackStockHandler, [
        'ProductPackRepository',
      ])

      //ORDER QUERIES
      queryBus.register('ListOrdersQuery', ListOrdersHandler, ['OrderRepository'])
      queryBus.register('GetOrderQuery', GetOrderHandler, ['OrderRepository'])
      queryBus.register('GetOrderByNumberQuery', GetOrderByNumberHandler, ['OrderRepository'])
      queryBus.register('ListCustomerOrdersQuery', ListCustomerOrdersHandler, ['OrderRepository'])

      //MARKET SERVICE QUERIES
      queryBus.register('ListMarketServicesQuery', ListMarketServicesHandler, [
        'MarketServiceCollection',
      ])
      queryBus.register('GetMarketServiceQuery', GetMarketServiceHandler, [
        'MarketServiceReadModel',
      ])

      //STAFF MEMBER QUERIES
      queryBus.register('ListStaffMembersQuery', ListStaffMembersHandler, ['StaffMemberCollection'])
      queryBus.register('GetStaffMemberQuery', GetStaffMemberHandler, ['StaffMemberRepository'])

      return queryBus
    })
  }

  public async boot() {}
  public async ready() {}
  public async shutdown() {}
}
