/**
 * Migration for table: admin
 */
export async function up(pool) {
    console.log('Creating table: admin...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`admin\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`name\` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  \`email\` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  \`password\` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  \`phone\` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`role\` enum('superadmin','staff') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'superadmin',
  \`status\` enum('active','inactive') COLLATE utf8mb4_general_ci DEFAULT 'active',
  \`last_login\` datetime DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  \`reset_password_otp\` varchar(6) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`reset_password_expires\` datetime DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`email\` (\`email\`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: admin...');
    await pool.query('DROP TABLE IF EXISTS admin');
}
