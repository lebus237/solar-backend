/**
 * Branded types for type-safe identifiers
 * These prevent mixing up different ID types (e.g., ProductId vs CustomerId)
 */

declare const brand: unique symbol

export type Brand<T, TBrand> = T & { readonly [brand]: TBrand }

export type ProductId = Brand<string, 'ProductId'>
export type ProductCategoryId = Brand<string, 'ProductCategoryId'>
export type ProductPackId = Brand<string, 'ProductPackId'>
export type ProductImageId = Brand<string, 'ProductImageId'>
export type CustomerId = Brand<string, 'CustomerId'>
export type AddressId = Brand<string, 'AddressId'>
export type OrderId = Brand<string, 'OrderId'>
export type OrderItemId = Brand<string, 'OrderItemId'>
export type UserId = Brand<string, 'UserId'>
export type StoreId = Brand<string, 'StoreId'>
export type MarketServiceId = Brand<string, 'MarketServiceId'>
export type ImageMediaId = Brand<string, 'ImageMediaId'>
export type StockMovementId = Brand<string, 'StockMovementId'>

/**
 * Type guards for runtime validation
 */
export function isProductId(value: string): value is ProductId {
  return isValidUuid(value)
}

export function isProductCategoryId(value: string): value is ProductCategoryId {
  return isValidUuid(value)
}

export function isProductPackId(value: string): value is ProductPackId {
  return isValidUuid(value)
}

export function isCustomerId(value: string): value is CustomerId {
  return isValidUuid(value)
}

export function isOrderId(value: string): value is OrderId {
  return isValidUuid(value)
}

export function isStoreId(value: string): value is StoreId {
  return isValidUuid(value)
}

/**
 * Helper to create branded IDs (for internal use)
 */
export function asProductId(id: string): ProductId {
  return id as ProductId
}

export function asProductCategoryId(id: string): ProductCategoryId {
  return id as ProductCategoryId
}

export function asProductPackId(id: string): ProductPackId {
  return id as ProductPackId
}

export function asProductImageId(id: string): ProductImageId {
  return id as ProductImageId
}

export function asCustomerId(id: string): CustomerId {
  return id as CustomerId
}

export function asAddressId(id: string): AddressId {
  return id as AddressId
}

export function asOrderId(id: string): OrderId {
  return id as OrderId
}

export function asOrderItemId(id: string): OrderItemId {
  return id as OrderItemId
}

export function asUserId(id: string): UserId {
  return id as UserId
}

export function asStoreId(id: string): StoreId {
  return id as StoreId
}

export function asMarketServiceId(id: string): MarketServiceId {
  return id as MarketServiceId
}

export function asImageMediaId(id: string): ImageMediaId {
  return id as ImageMediaId
}

export function asStockMovementId(id: string): StockMovementId {
  return id as StockMovementId
}

/**
 * UUID validation helper
 */
function isValidUuid(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(value)
}

/**
 * Convert branded IDs back to strings for persistence layer
 * Use these when passing IDs to Active Record methods
 */
export function toProductIdString(id: ProductId): string {
  return id as string
}

export function toProductCategoryIdString(id: ProductCategoryId): string {
  return id as string
}

export function toProductPackIdString(id: ProductPackId): string {
  return id as string
}

export function toCustomerIdString(id: CustomerId): string {
  return id as string
}

export function toAddressIdString(id: AddressId): string {
  return id as string
}

export function toOrderIdString(id: OrderId): string {
  return id as string
}

export function toUserIdString(id: UserId): string {
  return id as string
}

export function toStoreIdString(id: StoreId): string {
  return id as string
}
