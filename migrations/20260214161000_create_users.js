export async function up(knex) {
    await knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.integer('status_id').unsigned().nullable().references('id').inTable('statuses');
        table.string('name', 100).notNullable();
        table.string('email', 150).notNullable().unique();
        table.string('password').notNullable();
        table.string('phone', 20).nullable();
        table.boolean('is_active').defaultTo(true).index();
        table.timestamp('last_login').nullable();
        table.string('reset_password_otp', 10).nullable();
        table.timestamp('reset_password_expires').nullable();
        table.timestamp('email_verified_at').nullable();
        table.string('remember_token').nullable();
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('users');
}
