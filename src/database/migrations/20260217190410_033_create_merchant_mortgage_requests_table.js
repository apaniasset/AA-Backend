/**
 * Migration for table: merchant_mortgage_requests
 */
export async function up(pool) {
    console.log('Creating table: merchant_mortgage_requests...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_mortgage_requests\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`user_id\` bigint unsigned DEFAULT NULL,
  \`property_id\` bigint unsigned DEFAULT NULL,
  \`name\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`email\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`phone\` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`property_price\` decimal(15,2) NOT NULL,
  \`down_payment\` decimal(15,2) NOT NULL,
  \`loan_amount\` decimal(15,2) NOT NULL,
  \`interest_rate\` decimal(5,2) NOT NULL,
  \`loan_tenure\` int NOT NULL,
  \`monthly_emi\` decimal(10,2) NOT NULL,
  \`status\` enum('pending','contacted','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`property_id\` (\`property_id\`),
  KEY \`idx_user_id\` (\`user_id\`),
  KEY \`idx_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_mortgage_requests...');
    await pool.query('DROP TABLE IF EXISTS merchant_mortgage_requests');
}
