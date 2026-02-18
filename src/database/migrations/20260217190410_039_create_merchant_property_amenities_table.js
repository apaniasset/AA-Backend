/**
 * Migration for table: merchant_property_amenities
 */
export async function up(pool) {
    console.log('Creating table: merchant_property_amenities...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_property_amenities\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`property_id\` bigint unsigned NOT NULL,
  \`amenity_id\` bigint unsigned NOT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`unique_property_amenity\` (\`property_id\`,\`amenity_id\`),
  KEY \`idx_property_id\` (\`property_id\`),
  KEY \`idx_amenity_id\` (\`amenity_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_property_amenities...');
    await pool.query('DROP TABLE IF EXISTS merchant_property_amenities');
}
