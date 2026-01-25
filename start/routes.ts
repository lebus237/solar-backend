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

const ProductCategoryController = () => import('#controllers/product/product_category_controller')
const ProductController = () => import('#controllers/product/product_controller')
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
    })
    // .middleware(middleware.auth())
  })
  .prefix('/api')
