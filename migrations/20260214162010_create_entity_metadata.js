export async function up(knex) {
    await knex.schema.createTable('entity_metadata', (table) => {
        table.increments('id').primary();
        table.string('entity_type', 50).notNullable().index(); // e.g., 'property', 'project', 'user'
        table.integer('entity_id').unsigned().notNullable().index();
        table.integer('metadata_id').unsigned().notNullable().references('id').inTable('metadata').onDelete('CASCADE');
        table.timestamps(true, true);
        table.unique(['entity_type', 'entity_id', 'metadata_id']);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('entity_metadata');
}
