import { CommandBus } from '#shared/infrastructure/bus/command_bus'
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

      return commandBus
    })

    // this.app.container.singleton('CQRS/QueryBus', () => {
    //   const queryBus = new QueryBus()
    //
    //   // Register query handlers
    //   // queryBus.register('GetUserByIdQuery', new GetUserByIdQueryHandler())
    //   // queryBus.register('GetAllUsersQuery', new GetAllUsersQueryHandler())
    //
    //   return queryBus
    // })
  }

  public async boot() {}
  public async ready() {}
  public async shutdown() {}
}
