/**
 * Migration for table: affiliate
 */
export async function up(pool) {
    console.log('Creating table: affiliate...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`affiliate\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`name\` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  \`email\` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  \`password\` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  \`phone\` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`referral_code\` varchar(80) COLLATE utf8mb4_general_ci NOT NULL,
  \`referred_by\` int DEFAULT NULL,
  \`parent_affiliate_id\` int DEFAULT NULL,
  \`level_id\` int DEFAULT NULL,
  \`total_active_income\` decimal(15,2) NOT NULL DEFAULT '0.00',
  \`total_passive_income\` decimal(15,2) NOT NULL DEFAULT '0.00',
  \`status\` enum('active','inactive','pending','blocked') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  \`last_login\` datetime DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  \`reset_password_otp\` varchar(6) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`reset_password_expires\` datetime DEFAULT NULL,
  \`registration_otp\` varchar(6) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`registration_otp_expires\` datetime DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`email\` (\`email\`),
  UNIQUE KEY \`referral_code\` (\`referral_code\`),
  KEY \`parent_affiliate_id\` (\`parent_affiliate_id\`),
  KEY \`level_id\` (\`level_id\`),
  KEY \`idx_affiliate_referred_by\` (\`referred_by\`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: affiliate...');
    await pool.query('DROP TABLE IF EXISTS affiliate');
}
