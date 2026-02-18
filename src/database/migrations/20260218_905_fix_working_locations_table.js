export async function up(pool) {
    console.log('Migrating merchant_working_locations table...');
    const [existingCols] = await pool.query('DESCRIBE merchant_working_locations');
    const existingNames = existingCols.map(c => c.Field);

    if (!existingNames.includes('country_id')) {
        console.log('  Adding column: country_id...');
        await pool.query('ALTER TABLE merchant_working_locations ADD COLUMN country_id INT NULL AFTER state_id');
    }
}
