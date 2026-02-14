export async function up(knex) {
    await knex.schema.createTable('states', (table) => {
        table.increments('id').primary();
        table.integer('country_id').unsigned().notNullable().references('id').inTable('countries').onDelete('CASCADE');
        table.string('name', 100).notNullable();
        table.boolean('is_active').defaultTo(true).index();
        table.unique(['country_id', 'name']);
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('states');
}
