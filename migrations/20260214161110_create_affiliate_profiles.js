export async function up(knex) {
    await knex.schema.createTable('affiliate_profiles', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().unique().references('id').inTable('users').onDelete('CASCADE');
        table.string('referral_code', 50).notNullable().unique();
        table.integer('referred_by_id').unsigned().nullable().references('id').inTable('users');
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('affiliate_profiles');
}
