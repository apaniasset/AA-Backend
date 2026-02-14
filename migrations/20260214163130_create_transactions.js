export async function up(knex) {
    await knex.schema.createTable('transactions', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
        table.integer('status_id').unsigned().notNullable().references('id').inTable('statuses');

        table.decimal('amount', 15, 2).notNullable();
        table.string('type', 20).notNullable(); // credit, debit
        table.string('description', 255).nullable();
        table.string('payment_method', 50).nullable();
        table.string('reference_id', 100).nullable();

        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('transactions');
}
