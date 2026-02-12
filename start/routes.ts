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
      router.resource('product', ProductController).use('*', middleware.auth())
      router.resource('product-category', ProductCategoryController).use('*', middleware.auth())
      router.resource('image-media', ImageMediasController).use('*', middleware.auth())
    })

    router
      .group(() => {
        router.resource('services', MarketServiceController).use('*', middleware.auth())
      })
      .prefix('/market')
  })
  .prefix('/api')
