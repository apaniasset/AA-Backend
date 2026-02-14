export async function up(knex) {
    await knex.schema.createTable('sub_localities', (table) => {
        table.increments('id').primary();
        table.integer('locality_id').unsigned().notNullable().references('id').inTable('localities').onDelete('CASCADE');
        table.string('name', 150).notNullable();
        table.boolean('is_active').defaultTo(true).index();
        table.unique(['locality_id', 'name']);
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('sub_localities');
}
