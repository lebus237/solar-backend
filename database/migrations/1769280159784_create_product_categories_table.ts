import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.enum('category_type', ['CATEGORY', 'TAG'])
      table.uuid('id').primary().unique().notNullable()
      table.string('designation', 255).unique().notNullable()
      table.string('category_slug').unique().notNullable()
      table
        .uuid('parent_id')
        .references('id')
        .inTable('product_categories')
        .onDelete('CASCADE')
        .nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.raw('DROP TYPE IF EXISTS "category_type"')
    this.schema.dropTable(this.tableName)
  }
}
