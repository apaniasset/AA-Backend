export async function up(pool) {
    console.log('Migrating merchant table...');
    const [existingCols] = await pool.query('DESCRIBE merchant');
    const existingNames = existingCols.map(c => c.Field);

    const columnsToAdd = [
        { field: 'status', type: "ENUM('active', 'inactive', 'pending', 'pending_registration', 'blocked') DEFAULT 'pending'" },
        { field: 'country_id', type: 'INT NULL' },
        { field: 'state_id', type: 'INT NULL' },
        { field: 'registration_otp', type: 'VARCHAR(6) NULL' },
        { field: 'registration_otp_expires', type: 'DATETIME NULL' },
        { field: 'reset_password_otp', type: 'VARCHAR(6) NULL' },
        { field: 'reset_password_expires', type: 'DATETIME NULL' },
        { field: 'login_otp', type: 'VARCHAR(6) NULL' },
        { field: 'login_otp_expires', type: 'DATETIME NULL' }
    ];

    for (const col of columnsToAdd) {
        if (!existingNames.includes(col.field)) {
            console.log(`  Adding column: ${col.field}...`);
            await pool.query(`
ALTER TABLE merchant ADD COLUMN ${col.field} ${col.type}
    `);
        }
    }
}
