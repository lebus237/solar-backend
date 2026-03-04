import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('stock_quantity').notNullable().defaultTo(0)
      table.integer('low_stock_threshold').notNullable().defaultTo(10)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('stock_quantity')
      table.dropColumn('low_stock_threshold')
    })
  }
}
