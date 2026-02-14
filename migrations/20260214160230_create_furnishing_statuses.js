export async function up(knex) {
    await knex.schema.createTable('furnishing_statuses', (table) => {
        table.increments('id').primary();
        table.string('name', 50).notNullable().unique();
        table.boolean('is_active').defaultTo(true).index();
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('furnishing_statuses');
}
