export async function up(knex) {
    await knex.schema.createTable('cities', (table) => {
        table.increments('id').primary();
        table.integer('state_id').unsigned().notNullable().references('id').inTable('states').onDelete('CASCADE');
        table.string('name', 100).notNullable();
        table.boolean('is_active').defaultTo(true).index();
        table.unique(['state_id', 'name']);
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('cities');
}
