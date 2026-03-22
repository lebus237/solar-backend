export enum StoreStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export type StoreStatus = {
  status: StoreStatusEnum
  reason?: string
}
