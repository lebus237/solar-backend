import { Hours } from '#shared/domain/value-objects/app_hour'
import { BusinessDay, DayOfWeek } from '#shared/domain/value-objects/business_day'

export class BusinessHours {
  private constructor(
    readonly day: BusinessDay,
    readonly open: Hours,
    readonly close: Hours
  ) {
    if (open.toTwentyFour() >= close.toTwentyFour())
      throw new Error(
        `Open (${open.toTwelveString()}) must be before close (${close.toTwelveString()})`
      )
  }

  static of(day: BusinessDay, open: Hours, close: Hours): BusinessHours {
    return new BusinessHours(day, open, close)
  }

  /** Convenience: accepts 24h integers */
  static from(day: DayOfWeek, openH: number, closeH: number): BusinessHours {
    return new BusinessHours(BusinessDay.of(day), Hours.of(openH), Hours.of(closeH))
  }

  static equals(a: BusinessHours, b: BusinessHours): boolean {
    return a.day.equals(b.day) && a.open.equals(b.open) && a.close.equals(b.close)
  }

  static equalDays(a: BusinessHours, b: BusinessHours): boolean {
    return a.day.equals(b.day)
  }

  static toJson(businessHours: BusinessHours): { day: DayOfWeek; open: number; close: number } {
    return {
      day: businessHours.day.toName(),
      open: Hours.toJson(businessHours.open).hours,
      close: Hours.toJson(businessHours.close).hours,
    }
  }

  static fromJson(json: { day: DayOfWeek; open: number; close: number }): BusinessHours {
    return new BusinessHours(BusinessDay.of(json.day), Hours.of(json.open), Hours.of(json.close))
  }

  // --- Queries ---

  isOpenAt(hour: Hours): boolean {
    const h = hour.toTwentyFour()
    return h >= this.open.toTwentyFour() && h < this.close.toTwentyFour()
  }

  isOpenNow(): boolean {
    const today = BusinessDay.today()
    if (!today.equals(this.day)) return false
    return this.isOpenAt(Hours.of(new Date().getHours()))
  }

  durationHours(): number {
    return this.close.toTwentyFour() - this.open.toTwentyFour()
  }

  // --- Display ---

  toString(): string {
    return `${this.day}: ${this.open.toTwelveString()} – ${this.close.toTwelveString()}`
  }
}
