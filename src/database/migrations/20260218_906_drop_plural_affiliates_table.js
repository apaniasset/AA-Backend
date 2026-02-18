/**
 * Migration to drop redundant plural affiliates table
 */
export async function up(pool) {
    console.log('Dropping redundant table: affiliates...');
    await pool.query('DROP TABLE IF EXISTS affiliates');
}

export async function down(pool) {
    // No-op: We don't want to recreate it as it was a duplicate
    console.log('Recreating affiliates table (No-op)...');
}
