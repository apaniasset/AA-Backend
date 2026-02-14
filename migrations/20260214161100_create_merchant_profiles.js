export async function up(knex) {
    await knex.schema.createTable('merchant_profiles', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().unique().references('id').inTable('users').onDelete('CASCADE');
        table.string('company_name', 150).nullable();
        table.string('rera_number', 50).nullable();
        table.string('gst_number', 50).nullable();
        table.string('profile_photo').nullable();
        table.text('address').nullable();
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('merchant_profiles');
}
