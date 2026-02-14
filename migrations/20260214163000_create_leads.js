export async function up(knex) {
    await knex.schema.createTable('leads', (table) => {
        table.increments('id').primary();
        table.integer('property_id').unsigned().nullable().references('id').inTable('properties').onDelete('SET NULL');
        table.integer('user_id').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
        table.integer('status_id').unsigned().nullable().references('id').inTable('statuses');

        table.string('name', 100).notNullable();
        table.string('email', 150).nullable();
        table.string('phone', 20).notNullable();
        table.text('message').nullable();
        table.string('source', 100).nullable();

        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('leads');
}
