/**
 * Migration for table: merchant_favorite_properties
 */
export async function up(pool) {
    console.log('Creating table: merchant_favorite_properties...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_favorite_properties\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`merchant_id\` bigint unsigned NOT NULL,
  \`property_id\` bigint unsigned NOT NULL,
  \`created_at\` timestamp NULL DEFAULT NULL,
  \`updated_at\` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`merchant_favorite_properties_merchant_id_foreign\` (\`merchant_id\`),
  KEY \`merchant_favorite_properties_property_id_foreign\` (\`property_id\`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_favorite_properties...');
    await pool.query('DROP TABLE IF EXISTS merchant_favorite_properties');
}
