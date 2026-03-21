import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'market_services'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('content_description').nullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('content_description').nullable().alter()
    })
  }
}
