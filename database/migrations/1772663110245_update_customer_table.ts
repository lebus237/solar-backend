import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customers'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('email', 255).nullable().alter()
      table.string('phone', 20).notNullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('email', 255).notNullable().alter()
      table.string('phone', 20).nullable().alter()
    })
  }
}
