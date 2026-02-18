/**
 * Migration for table: merchant_property_views
 */
export async function up(pool) {
    console.log('Creating table: merchant_property_views...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_property_views\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`property_id\` bigint unsigned NOT NULL,
  \`merchant_id\` bigint unsigned DEFAULT NULL,
  \`user_id\` bigint unsigned DEFAULT NULL,
  \`created_at\` timestamp NULL DEFAULT NULL,
  \`updated_at\` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`property_id\` (\`property_id\`),
  KEY \`merchant_id\` (\`merchant_id\`),
  KEY \`user_id\` (\`user_id\`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_property_views...');
    await pool.query('DROP TABLE IF EXISTS merchant_property_views');
}
