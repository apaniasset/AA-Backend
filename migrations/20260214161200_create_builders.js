export async function up(knex) {
    await knex.schema.createTable('builders', (table) => {
        table.increments('id').primary();
        table.string('name', 150).notNullable();
        table.string('logo').nullable();
        table.text('description').nullable();
        table.string('website', 255).nullable();
        table.boolean('is_active').defaultTo(true).index();
        table.boolean('is_verified').defaultTo(false);
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('builders');
}
