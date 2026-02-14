export async function up(knex) {
    await knex.schema.createTable('countries', (table) => {
        table.increments('id').primary();
        table.string('name', 100).notNullable().unique();
        table.string('iso_code', 3).notNullable().unique();
        table.boolean('is_active').defaultTo(true).index();
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('countries');
}
