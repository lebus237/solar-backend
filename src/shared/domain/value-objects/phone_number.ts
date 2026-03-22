type PhoneNumberFormat = 'E164' | 'NATIONAL' | 'INTERNATIONAL'

export class PhoneNumber {
  private readonly countryCode: string // e.g. "1", "44", "237"
  private readonly number: string // digits only, no country code

  private constructor(countryCode: string, number: string) {
    this.countryCode = countryCode
    this.number = number
  }

  /** Parse from E.164 format: "+12025551234" */
  static fromE164(raw: string): PhoneNumber {
    const match = raw.trim().match(/^\+(\d{1,3})(\d{6,14})$/)
    if (!match) throw new Error(`Invalid E.164 phone number: "${raw}"`)
    return new PhoneNumber(match[1], match[2])
  }

  /** From explicit parts */
  static of(phone: { countryCode: string; number: string }): PhoneNumber {
    console.log(`PhoneNumber.of: ${JSON.stringify(phone)}`)
    if (!/^\d{1,3}$/.test(phone.countryCode))
      throw new Error(`Invalid country code: "${phone.countryCode}"`)
    if (!/^\d{6,14}$/.test(phone.number))
      throw new Error(`Invalid number (digits only, 6–14): "${phone.number}"`)
    return new PhoneNumber(phone.countryCode, phone.number)
  }

  static toJson(phoneNumber: PhoneNumber) {
    return {
      countryCode: phoneNumber.countryCode,
      number: phoneNumber.number,
    }
  }

  countryDialCode(): string {
    return `+${this.countryCode}`
  }

  // --- Formatting ---

  toE164(): string {
    return `+${this.countryCode}${this.number}`
  }

  toInternational(): string {
    return `+${this.countryCode} ${this.format(this.number)}`
  }

  toNational(): string {
    return this.format(this.number)
  }

  format(style: PhoneNumberFormat): string
  format(digits?: string): string
  format(arg?: PhoneNumberFormat | string): string {
    if (arg === 'E164') return this.toE164()
    if (arg === 'INTERNATIONAL') return this.toInternational()
    if (arg === 'NATIONAL') return this.toNational()

    // Basic grouping: last 4, then groups of 3 from right
    const d = arg ?? this.number
    if (d.length <= 4) return d
    const tail = d.slice(-4)
    const head = d.slice(0, -4).replace(/(\d{3})(?=\d)/g, '$1 ')
    return `${head} ${tail}`.trim()
  }

  equals(other: PhoneNumber): boolean {
    return this.toE164() === other.toE164()
  }

  toString(): string {
    return this.toInternational()
  }
}
