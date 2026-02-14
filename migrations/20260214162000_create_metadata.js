export async function up(knex) {
    await knex.schema.createTable('metadata', (table) => {
        table.increments('id').primary();
        table.string('meta_key', 100).notNullable().index(); // e.g., 'features', 'amenities', 'user_preferences'
        table.string('label_name', 100).notNullable();
        table.string('value', 255).notNullable();
        table.text('description').nullable();
        table.integer('status_id').unsigned().nullable().references('id').inTable('statuses');
        table.boolean('is_active').defaultTo(true).index();
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('metadata');
}
