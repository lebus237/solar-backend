/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ImageMediasController = () => import('#controllers/media/image_medias_controller')
const ProductCategoryController = () => import('#controllers/product/product_category_controller')
const ProductController = () => import('#controllers/product/product_controller')
const MarketServiceController = () => import('#controllers/market/market_services_controller')
const StoreController = () => import('#controllers/store/store_controller')
const AuthController = () => import('#controllers/authentication/auth_controller')
const StockController = () => import('#controllers/product/stock_controller')
const CustomerController = () => import('#controllers/customer/customer_controller')
const OrderController = () => import('#controllers/order/order_controller')

router
  .group(() => {
    router.group(() => {
      router.post('/register', [AuthController, 'register'])
      router.post('/login', [AuthController, 'login'])

      router.get('/me', [AuthController, 'me']).use(middleware.auth())

      router.get('/logout', [AuthController, 'logout'])
    })

    router.group(() => {
      router.resource('store', StoreController)
      router
        .get('product/grouped-by-category', [ProductController, 'groupedByCategory'])
        .use(middleware.auth())
      router.resource('product', ProductController).use('*', middleware.auth())
      router
        .get('product-category/:id/products', [ProductCategoryController, 'products'])
        .use(middleware.auth())
      router.resource('product-category', ProductCategoryController).use('*', middleware.auth())
      router.resource('image-media', ImageMediasController).use('*', middleware.auth())

      // Stock routes
      router
        .group(() => {
          router.get('/:id/stock', [StockController, 'show'])
          router.post('/:id/stock/add', [StockController, 'add'])
          router.post('/:id/stock/remove', [StockController, 'remove'])
          router.put('/:id/stock', [StockController, 'set'])
          router.get('/:id/stock/history', [StockController, 'history'])
        })
        .prefix('product')
        .use(middleware.auth())

      router.get('/products/low-stock', [StockController, 'lowStock']).use(middleware.auth())
    })

    router
      .group(() => {
        router.resource('services', MarketServiceController).use('*', middleware.auth())
      })
      .prefix('/market')

    // Customer routes
    router
      .group(() => {
        router.get('/', [CustomerController, 'index'])
        router.post('/', [CustomerController, 'store'])
        router.get('/:id', [CustomerController, 'show'])
        router.put('/:id', [CustomerController, 'update'])
        router.get('/:customerId/addresses', [CustomerController, 'addresses'])
        router.post('/:customerId/addresses', [CustomerController, 'addAddress'])
        // router.put('/:id/addresses/:addressId', [CustomerController, 'updateAddress'])
        // router.delete('/:id/addresses/:addressId', [CustomerController, 'deleteAddress'])
      })
      .prefix('customers')
      .use(middleware.auth())

    // Order routes
    router
      .group(() => {
        router.get('/', [OrderController, 'index'])
        router.post('/', [OrderController, 'store'])
        router.get('/number/:orderNumber', [OrderController, 'findByOrderNumber'])
        router.get('/customer/:customerId', [OrderController, 'byCustomer'])
        router.get('/:id', [OrderController, 'show'])
        router.put('/:id/status', [OrderController, 'updateStatus'])
        router.post('/:id/cancel', [OrderController, 'cancel'])
      })
      .prefix('orders')
      .use(middleware.auth())
  })
  .prefix('/api')
