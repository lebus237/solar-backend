import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stores'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('description')
      table.dropColumn('domain_url')

      table.json('phone_contact_1').notNullable()
      table.json('phone_contact_2').nullable()
      table.json('whatsapp_contact').nullable()
      table
        .enu('status', ['active', 'inactive'], {
          useNative: true,
          enumName: 'store_status',
          existingType: false,
        })
        .notNullable()
      table.text('status_reason').nullable()
    })
  }

  async down() {
    this.schema.raw('DROP TYPE IF EXISTS "store_status"')
    this.schema.dropTable(this.tableName)
  }
}
