export async function up(knex) {
    await knex.schema.createTable('listing_types', (table) => {
        table.increments('id').primary();
        table.string('name', 50).notNullable().unique();
        table.boolean('is_active').defaultTo(true).index();
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('listing_types');
}
