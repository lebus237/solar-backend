export interface MarketServiceListItemDto {
  id: string
  slug: string
  designation: string
  thumbnailUrl: string
  shortDescription: string | null
  createdAt: unknown
  updatedAt: unknown
}

export interface MarketServiceDetailsDto {
  id: string
  slug: string
  designation: string
  thumbnailUrl: string
  thumbnailId: string | null
  shortDescription: string | null
  contentDescription: string | null
  createdAt: unknown
  updatedAt: unknown
}
