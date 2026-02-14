export async function up(knex) {
    await knex.schema.createTable('statuses', (table) => {
        table.increments('id').primary();
        table.string('module', 50).notNullable().index();
        table.string('name', 50).notNullable();
        table.boolean('is_active').defaultTo(true).index();
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('statuses');
}
