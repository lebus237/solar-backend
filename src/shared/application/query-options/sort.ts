export type SortDirection = 'asc' | 'desc'

export class Sort {
  constructor(
    public field: string,
    public direction: SortDirection
  ) {}
}
