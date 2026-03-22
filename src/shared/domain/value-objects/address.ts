export class Address {
  private constructor(
    readonly street: string,
    readonly city: string,
    readonly country?: string,
    readonly postalCode?: string,
    readonly region?: string // state / province / department
  ) {
    if (!street.trim()) throw new Error('Street is required')
    if (!city.trim()) throw new Error('City is required')
    if (!country?.trim()) throw new Error('Country is required')
  }

  static of(props: {
    street: string
    city: string
    country?: string
    postalCode?: string
    region?: string
  }): Address {
    return new Address(
      props.street.trim(),
      props.city.trim(),
      props.country?.trim(),
      props.postalCode?.trim(),
      props.region?.trim()
    )
  }

  static toJson(address: Address) {
    return {
      street: address.street,
      city: address.city,
      country: address.country,
      postalCode: address.postalCode,
      region: address.region,
    }
  }

  // --- Display ---

  toLines(): (string | undefined)[] {
    return [
      this.street,
      [this.city, this.region, this.postalCode].filter(Boolean).join(', '),
      this.country,
    ]
  }

  toString(): string {
    return this.toLines().join('\n')
  }

  toInline(): string {
    return this.toLines().join(', ')
  }

  // --- Comparison ---

  equals(other: Address): boolean {
    return this.toInline().toLowerCase() === other.toInline().toLowerCase()
  }
}
