export async function up(knex) {
    await knex.schema.createTable('localities', (table) => {
        table.increments('id').primary();
        table.integer('city_id').unsigned().notNullable().references('id').inTable('cities').onDelete('CASCADE');
        table.string('name', 150).notNullable();
        table.string('pincode', 20).nullable();
        table.boolean('is_active').defaultTo(true).index();
        table.unique(['city_id', 'name']);
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('localities');
}
