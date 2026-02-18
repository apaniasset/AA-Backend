export async function up(pool) {
    console.log('Migrating affiliate table...');
    const [existingCols] = await pool.query('DESCRIBE affiliate');
    const existingNames = existingCols.map(c => c.Field);

    const columnsToAdd = [
        { field: 'status', type: "ENUM('active', 'inactive', 'pending', 'pending_registration', 'blocked') DEFAULT 'active'" },
        { field: 'registration_otp', type: 'VARCHAR(6) NULL' },
        { field: 'registration_otp_expires', type: 'DATETIME NULL' },
        { field: 'reset_password_otp', type: 'VARCHAR(6) NULL' },
        { field: 'reset_password_expires', type: 'DATETIME NULL' },
        { field: 'last_login', type: 'DATETIME NULL' }
    ];

    for (const col of columnsToAdd) {
        if (!existingNames.includes(col.field)) {
            console.log(`  Adding column: ${col.field}...`);
            await pool.query(`
ALTER TABLE affiliate ADD COLUMN ${col.field} ${col.type}
    `);
        }
    }
}
