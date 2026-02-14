export async function up(knex) {
    await knex.schema.createTable('user_packages', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.integer('package_id').unsigned().notNullable().references('id').inTable('packages');
        table.integer('status_id').unsigned().nullable().references('id').inTable('statuses');

        table.dateTime('start_date').notNullable();
        table.dateTime('end_date').notNullable();
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('user_packages');
}
