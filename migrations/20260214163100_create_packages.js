export async function up(knex) {
    await knex.schema.createTable('packages', (table) => {
        table.increments('id').primary();
        table.string('name', 100).notNullable();
        table.decimal('price', 15, 2).notNullable();
        table.integer('duration_days').notNullable();
        table.integer('listing_limit').defaultTo(0);
        table.integer('featured_limit').defaultTo(0);
        table.boolean('is_active').defaultTo(true).index();
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('packages');
}
