export async function up(knex) {
    await knex.schema.createTable('saved_searches', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');

        table.string('name', 150).nullable();
        table.json('criteria').notNullable(); // { bhk: [1,2], city: 5, price_max: 5000000, etc }
        table.boolean('is_active').defaultTo(true).index();
        table.boolean('is_alert_active').defaultTo(true);

        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('saved_searches');
}
