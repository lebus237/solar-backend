export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'

export class BusinessDay {
  private static readonly DAYS: DayOfWeek[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ]

  private readonly value: number // 0 (Mon) – 4 (Fri)

  private constructor(value: number) {
    this.value = value
  }

  /** From a day name */
  static of(day: DayOfWeek | number): BusinessDay {
    return typeof day === 'number'
      ? new BusinessDay(day)
      : new BusinessDay(BusinessDay.DAYS.indexOf(day))
  }

  /** From ISO weekday number: 1 (Mon) – 5 (Fri) */
  static fromIso(iso: number): BusinessDay {
    if (!Number.isInteger(iso) || iso < 1 || iso > 5)
      throw new Error('ISO business day must be between 1 (Mon) and 5 (Fri)')
    return new BusinessDay(iso - 1)
  }

  /** From a Date — throws if weekend */
  static fromDate(date: Date): BusinessDay {
    const dow = date.getDay() // 0 = Sun, 6 = Sat
    if (dow === 0 || dow === 6) throw new Error(`${date.toDateString()} is not a business day`)
    return new BusinessDay(dow - 1) // Mon=1 → 0
  }

  /** Today — throws if weekend */
  static today(): BusinessDay {
    return BusinessDay.fromDate(new Date())
  }

  static toJson(businessDay: BusinessDay): { businessDay: number } {
    return {
      businessDay: businessDay.value,
    }
  }

  // --- Queries ---

  isMonday(): boolean {
    return this.value === 0
  }
  isFriday(): boolean {
    return this.value === 4
  }
  isFirstOfWeek(): boolean {
    return this.isMonday()
  }
  isLastOfWeek(): boolean {
    return this.isFriday()
  }

  // --- Navigation ---

  next(): BusinessDay {
    return new BusinessDay((this.value + 1) % 5)
  }

  previous(): BusinessDay {
    return new BusinessDay((this.value + 4) % 5)
  }

  /** Advance by n business days (wraps within the week) */
  addDays(n: number): BusinessDay {
    if (!Number.isInteger(n)) throw new Error('n must be an integer')
    return new BusinessDay((((this.value + n) % 5) + 5) % 5)
  }

  /** Business days remaining until Friday (inclusive of self: 0 on Friday) */
  daysUntilEndOfWeek(): number {
    return 4 - this.value
  }

  /** Business days since Monday (0 on Monday) */
  daysSinceStartOfWeek(): number {
    return this.value
  }

  // --- Conversions ---

  toIso(): number {
    return this.value + 1 // 1–5
  }

  toName(): DayOfWeek {
    return BusinessDay.DAYS[this.value]
  }

  equals(other: BusinessDay): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.toName()
  }
}
