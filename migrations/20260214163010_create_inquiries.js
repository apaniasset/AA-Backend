export async function up(knex) {
    await knex.schema.createTable('inquiries', (table) => {
        table.increments('id').primary();
        table.integer('property_id').unsigned().notNullable().references('id').inTable('properties').onDelete('CASCADE');
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.integer('status_id').unsigned().nullable().references('id').inTable('statuses');

        table.text('message').notNullable();
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('inquiries');
}
