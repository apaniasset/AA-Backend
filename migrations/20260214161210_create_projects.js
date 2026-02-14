export async function up(knex) {
    await knex.schema.createTable('projects', (table) => {
        table.increments('id').primary();
        table.integer('builder_id').unsigned().nullable().references('id').inTable('builders').onDelete('SET NULL');
        table.integer('city_id').unsigned().nullable().references('id').inTable('cities');
        table.integer('locality_id').unsigned().nullable().references('id').inTable('localities');
        table.integer('status_id').unsigned().nullable().references('id').inTable('statuses');

        table.string('name', 200).notNullable();
        table.text('description').nullable();
        table.string('latitude', 50).nullable();
        table.string('longitude', 50).nullable();
        table.boolean('is_active').defaultTo(true).index();
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('projects');
}
