/**
 * Migration for table: merchant_site_visits
 */
export async function up(pool) {
    console.log('Creating table: merchant_site_visits...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_site_visits\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`property_id\` bigint unsigned NOT NULL,
  \`user_id\` bigint unsigned DEFAULT NULL,
  \`visitor_name\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`visitor_email\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`visitor_phone\` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`visit_date\` date NOT NULL,
  \`visit_time\` time NOT NULL,
  \`number_of_people\` int DEFAULT '1',
  \`status\` enum('requested','confirmed','completed','cancelled','no_show') COLLATE utf8mb4_unicode_ci DEFAULT 'requested',
  \`notes\` text COLLATE utf8mb4_unicode_ci,
  \`feedback\` text COLLATE utf8mb4_unicode_ci,
  \`feedback_rating\` decimal(2,1) DEFAULT NULL,
  \`cancelled_by\` enum('user','owner','system') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`cancellation_reason\` text COLLATE utf8mb4_unicode_ci,
  \`confirmed_at\` timestamp NULL DEFAULT NULL,
  \`completed_at\` timestamp NULL DEFAULT NULL,
  \`cancelled_at\` timestamp NULL DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_property_id\` (\`property_id\`),
  KEY \`idx_user_id\` (\`user_id\`),
  KEY \`idx_visit_date\` (\`visit_date\`),
  KEY \`idx_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_site_visits...');
    await pool.query('DROP TABLE IF EXISTS merchant_site_visits');
}
