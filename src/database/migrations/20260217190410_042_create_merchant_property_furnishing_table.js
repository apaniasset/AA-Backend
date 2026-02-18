/**
 * Migration for table: merchant_property_furnishing
 */
export async function up(pool) {
    console.log('Creating table: merchant_property_furnishing...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_property_furnishing\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`property_id\` bigint unsigned NOT NULL,
  \`furnishing_item_id\` bigint unsigned NOT NULL,
  \`quantity\` int DEFAULT '1',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`unique_property_furnishing\` (\`property_id\`,\`furnishing_item_id\`),
  KEY \`furnishing_item_id\` (\`furnishing_item_id\`),
  KEY \`idx_property_id\` (\`property_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_property_furnishing...');
    await pool.query('DROP TABLE IF EXISTS merchant_property_furnishing');
}
