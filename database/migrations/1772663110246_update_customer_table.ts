import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customers'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('phone', 20).unique().alter()
    })
  }

  async down() {}
}
