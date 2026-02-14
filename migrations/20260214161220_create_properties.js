export async function up(knex) {
    await knex.schema.createTable('properties', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
        table.integer('project_id').unsigned().nullable().references('id').inTable('projects');
        table.integer('listing_type_id').unsigned().nullable().references('id').inTable('listing_types');
        table.integer('property_type_id').unsigned().nullable().references('id').inTable('property_types');
        table.integer('bhk_type_id').unsigned().nullable().references('id').inTable('bhk_types');
        table.integer('furnishing_status_id').unsigned().nullable().references('id').inTable('furnishing_statuses');
        table.integer('facing_direction_id').unsigned().nullable().references('id').inTable('facing_directions');
        table.integer('construction_status_id').unsigned().nullable().references('id').inTable('construction_statuses');
        table.integer('status_id').unsigned().nullable().references('id').inTable('statuses');

        table.integer('city_id').unsigned().nullable().references('id').inTable('cities');
        table.integer('locality_id').unsigned().nullable().references('id').inTable('localities');
        table.integer('sub_locality_id').unsigned().nullable().references('id').inTable('sub_localities');

        table.string('title', 255).notNullable();
        table.text('description').nullable();
        table.decimal('price', 15, 2).nullable();
        table.decimal('area_sqft', 15, 2).nullable();
        table.string('area_type', 50).nullable(); // Carpet, Built-up, Super Built-up
        table.integer('floor_number').nullable();
        table.integer('total_floors').nullable();
        table.boolean('is_active').defaultTo(true).index();
        table.timestamps(true, true);
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('properties');
}
