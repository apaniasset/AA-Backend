/**
 * Migration for table: merchant_property_inquiries
 */
export async function up(pool) {
    console.log('Creating table: merchant_property_inquiries...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_property_inquiries\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`property_id\` bigint unsigned NOT NULL,
  \`merchant_id\` bigint unsigned DEFAULT NULL,
  \`user_id\` bigint unsigned DEFAULT NULL,
  \`name\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`email\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`phone\` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`message\` text COLLATE utf8mb4_unicode_ci,
  \`inquiry_type\` enum('site_visit','call_back','price_negotiation','general','other','view') COLLATE utf8mb4_unicode_ci DEFAULT 'general',
  \`preferred_date\` date DEFAULT NULL,
  \`preferred_time\` time DEFAULT NULL,
  \`status\` enum('pending','contacted','scheduled','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  \`response\` text COLLATE utf8mb4_unicode_ci,
  \`responded_at\` timestamp NULL DEFAULT NULL,
  \`responded_by\` bigint unsigned DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`responded_by\` (\`responded_by\`),
  KEY \`idx_property_id\` (\`property_id\`),
  KEY \`idx_user_id\` (\`user_id\`),
  KEY \`idx_status\` (\`status\`),
  KEY \`idx_created_at\` (\`created_at\`),
  KEY \`merchant_id\` (\`merchant_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_property_inquiries...');
    await pool.query('DROP TABLE IF EXISTS merchant_property_inquiries');
}
