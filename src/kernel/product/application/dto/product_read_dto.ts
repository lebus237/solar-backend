export interface ProductListItemDto {
  id: string
  slug: string
  designation: string
  price: number
  category: {
    id: string | null
    designation: string | null
  }
  mainImage: {
    url: string | null
    alt: string | null
    title: string | null
  }
  stockQuantity: number
  brand: string | null
  createdAt: unknown
  updatedAt: unknown
}

export interface ProductDetailsDto {
  id: string
  slug: string
  categoryId: string | null
  designation: string
  description: string
  price: number
  brand: string | null
  isAvailable: boolean
  isDeleted: boolean
  createdAt: unknown
  updatedAt: unknown
  category: {
    id: string | null
    designation: string | null
  }
  mainImage: {
    id: string | null
    url: string | null
    alt: string | null
    title: string | null
  }
  images: Array<{
    id: string
    url: string | null
    alt: string | null
    title: string | null
  }>
}

export interface GroupedProductsByCategoryDto {
  categoryId: string
  categoryName: string
  products: Array<{
    id: string
    slug: string
    designation: string
    price: number
    categoryName: string | null
    categoryId: string | null
    mainImageUrl: string | null
    brand: string | null
    createdAt: unknown
    updatedAt: unknown
  }>
}
