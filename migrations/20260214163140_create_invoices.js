export async function up(knex) {
    await knex.schema.createTable('invoices', (table) => {
        table.increments('id').primary();
        table.integer('transaction_id').unsigned().notNullable().references('id').inTable('transactions').onDelete('CASCADE');
        table.string('invoice_number', 100).notNullable().unique();
        table.string('file_path', 255).nullable();
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('invoices');
}
