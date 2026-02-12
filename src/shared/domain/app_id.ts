import crypto from 'node:crypto'

export class AppId {
  constructor(private readonly _value: crypto.UUID) {}
  static generate() {
    return crypto.randomUUID()
  }

  static fromString(value: crypto.UUID) {
    return new AppId(value)
  }

  get value() {
    return this._value
  }
}
