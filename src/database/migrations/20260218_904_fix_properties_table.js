export async function up(pool) {
    console.log('Migrating merchant_properties table...');
    const [existingCols] = await pool.query('DESCRIBE merchant_properties');
    const existingNames = existingCols.map(c => c.Field);

    const columnsToAdd = [
        { field: 'user_id', type: 'INT NULL', after: 'merchant_id' },
        { field: 'admin_id', type: 'INT NULL', after: 'user_id' },
        { field: 'city_id', type: 'INT NULL' },
        { field: 'state_id', type: 'INT NULL', after: 'city_id' },
        { field: 'country_id', type: 'INT NULL', after: 'state_id' },
        { field: 'locality_id', type: 'INT NULL' },
        { field: 'status', type: "VARCHAR(20) DEFAULT 'pending'" }
    ];

    for (const col of columnsToAdd) {
        if (!existingNames.includes(col.field)) {
            console.log(`  Adding column: ${col.field}...`);
            let query = `ALTER TABLE merchant_properties ADD COLUMN ${col.field} ${col.type}`;
            if (col.after) query += ` AFTER ${col.after}`;
            await pool.query(query);
        }
    }
}
