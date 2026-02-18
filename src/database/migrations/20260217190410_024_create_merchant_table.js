/**
 * Migration for table: merchant
 */
export async function up(pool) {
    console.log('Creating table: merchant...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`merchant_type\` enum('broker','owner','builder') COLLATE utf8mb4_general_ci NOT NULL,
  \`affiliate_id\` int DEFAULT NULL,
  \`name\` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  \`company_name\` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`email\` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  \`password\` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  \`phone\` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`alt_phone\` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`rera_number\` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`gst_number\` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`address_line1\` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`address_line2\` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`city\` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`city_id\` bigint unsigned DEFAULT NULL,
  \`area_id\` bigint unsigned DEFAULT NULL,
  \`area_name\` varchar(191) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`state\` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`state_id\` bigint unsigned DEFAULT NULL,
  \`country\` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`pincode\` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`profile_photo\` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`status\` enum('active','inactive','pending','blocked') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  \`last_login\` datetime DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  \`reset_password_otp\` varchar(6) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`reset_password_expires\` datetime DEFAULT NULL,
  \`login_otp\` varchar(6) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`login_otp_expires\` datetime DEFAULT NULL,
  \`registration_otp\` varchar(6) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`registration_otp_expires\` datetime DEFAULT NULL,
  \`country_id\` int DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`email\` (\`email\`),
  KEY \`idx_merchant_affiliate_id\` (\`affiliate_id\`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant...');
    await pool.query('DROP TABLE IF EXISTS merchant');
}
