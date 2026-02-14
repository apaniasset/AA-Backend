export async function up(knex) {
    await knex.schema.createTable('attachments', (table) => {
        table.increments('id').primary();
        table.string('entity_type', 50).notNullable().index(); // e.g., 'property', 'project', 'user', 'builder'
        table.integer('entity_id').unsigned().notNullable().index();
        table.string('file_path').notNullable();
        table.string('file_type', 50).defaultTo('image'); // image, video, document, floor_plan
        table.string('original_name').nullable();
        table.string('mime_type', 100).nullable();
        table.integer('file_size').unsigned().nullable();
        table.boolean('is_primary').defaultTo(false);
        table.integer('sort_order').defaultTo(0);
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('attachments');
}
