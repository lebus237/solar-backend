import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'market_services'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('thumbnail_url')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('thumbnail_url', 255).nullable()
    })
  }
}
