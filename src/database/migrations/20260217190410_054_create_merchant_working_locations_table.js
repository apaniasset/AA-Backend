/**
 * Migration for table: merchant_working_locations
 */
export async function up(pool) {
    console.log('Creating table: merchant_working_locations...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_working_locations\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`merchant_id\` bigint unsigned NOT NULL,
  \`state_id\` bigint unsigned DEFAULT NULL,
  \`country_id\` int DEFAULT NULL,
  \`city_id\` bigint unsigned DEFAULT NULL,
  \`city_name\` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`area_id\` bigint unsigned DEFAULT NULL,
  \`area_name\` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`pincode\` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`created_at\` timestamp NULL DEFAULT NULL,
  \`updated_at\` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`merchant_working_locations_merchant_id_foreign\` (\`merchant_id\`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_working_locations...');
    await pool.query('DROP TABLE IF EXISTS merchant_working_locations');
}
