import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'market_services'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json('content_description').nullable().alter()
    })
  }

  async down() {}
}
