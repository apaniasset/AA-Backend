export async function up(pool) {
    console.log('Migrating users table...');
    const [existingCols] = await pool.query('DESCRIBE users');
    const existingNames = existingCols.map(c => c.Field);

    const columnsToAdd = [
        { field: 'phone', type: 'VARCHAR(30) NULL' },
        { field: 'status', type: "ENUM('active', 'inactive', 'pending', 'pending_registration', 'blocked') DEFAULT 'active'" },
        { field: 'role', type: "VARCHAR(191) DEFAULT 'user'" },
        { field: 'last_login', type: 'DATETIME NULL' },
        { field: 'reset_password_otp', type: 'VARCHAR(6) NULL' },
        { field: 'reset_password_expires', type: 'DATETIME NULL' },
        { field: 'registration_otp', type: 'VARCHAR(6) NULL' },
        { field: 'registration_otp_expires', type: 'DATETIME NULL' },
        { field: 'login_otp', type: 'VARCHAR(6) NULL' },
        { field: 'login_otp_expires', type: 'DATETIME NULL' }
    ];

    for (const col of columnsToAdd) {
        if (!existingNames.includes(col.field)) {
            console.log(`  Adding column: ${col.field}...`);
            await pool.query(`
ALTER TABLE users ADD COLUMN ${col.field} ${col.type}
    `);
        }
    }
}
