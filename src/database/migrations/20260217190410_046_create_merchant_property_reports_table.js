/**
 * Migration for table: merchant_property_reports
 */
export async function up(pool) {
    console.log('Creating table: merchant_property_reports...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_property_reports\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`property_id\` bigint unsigned NOT NULL,
  \`reported_by\` bigint unsigned DEFAULT NULL,
  \`report_type\` enum('fake_listing','wrong_info','duplicate','sold_rented','spam','inappropriate','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  \`description\` text COLLATE utf8mb4_unicode_ci,
  \`status\` enum('pending','reviewing','resolved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  \`admin_notes\` text COLLATE utf8mb4_unicode_ci,
  \`resolved_by\` bigint unsigned DEFAULT NULL,
  \`resolved_at\` timestamp NULL DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`reported_by\` (\`reported_by\`),
  KEY \`resolved_by\` (\`resolved_by\`),
  KEY \`idx_property_id\` (\`property_id\`),
  KEY \`idx_status\` (\`status\`),
  KEY \`idx_created_at\` (\`created_at\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_property_reports...');
    await pool.query('DROP TABLE IF EXISTS merchant_property_reports');
}
