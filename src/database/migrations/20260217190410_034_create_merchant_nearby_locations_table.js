/**
 * Migration for table: merchant_nearby_locations
 */
export async function up(pool) {
    console.log('Creating table: merchant_nearby_locations...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_nearby_locations\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`property_id\` bigint unsigned NOT NULL,
  \`location_type\` enum('school','hospital','metro','bus_stop','railway','airport','mall','market','bank','atm','restaurant','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  \`name\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`distance\` decimal(5,2) NOT NULL,
  \`travel_time\` int DEFAULT NULL,
  \`description\` text COLLATE utf8mb4_unicode_ci,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_property_id\` (\`property_id\`),
  KEY \`idx_location_type\` (\`location_type\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_nearby_locations...');
    await pool.query('DROP TABLE IF EXISTS merchant_nearby_locations');
}
