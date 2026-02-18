/**
 * Migration for table: users
 */
export async function up(pool) {
    console.log('Creating table: users...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`email\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`email_verified_at\` timestamp NULL DEFAULT NULL,
  \`password\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`remember_token\` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`created_at\` timestamp NULL DEFAULT NULL,
  \`updated_at\` timestamp NULL DEFAULT NULL,
  \`role\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  \`reset_password_otp\` varchar(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`reset_password_expires\` datetime DEFAULT NULL,
  \`registration_otp\` varchar(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`registration_otp_expires\` datetime DEFAULT NULL,
  \`phone\` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`status\` enum('active','inactive','pending','pending_registration','blocked') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  \`last_login\` datetime DEFAULT NULL,
  \`login_otp\` varchar(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`login_otp_expires\` datetime DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: users...');
    await pool.query('DROP TABLE IF EXISTS users');
}
