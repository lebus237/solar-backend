export interface ProductPackItemDto {
  id: string
  productId: string
  productName: string
  // productSlug: string
  // productPrice: number
  // quantity: number
  // sortOrder: number
  productMainImageUrl: string | null
}

export interface ProductPackDetailsDto {
  id: string
  designation: string
  slug: string
  description: string | null
  price: number
  mainImageUrl: string | null
  stockQuantity: number | null
  // lowStockThreshold: number
  isAvailable: boolean
  // isDeleted: boolean
  items: ProductPackItemDto[]
  createdAt: string
  updatedAt: string
}
