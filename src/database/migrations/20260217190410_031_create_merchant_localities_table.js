/**
 * Migration for table: merchant_localities
 */
export async function up(pool) {
    console.log('Creating table: merchant_localities...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_localities\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`city_id\` bigint unsigned NOT NULL,
  \`name\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`description\` text COLLATE utf8mb4_unicode_ci,
  \`latitude\` decimal(10,8) DEFAULT NULL,
  \`longitude\` decimal(11,8) DEFAULT NULL,
  \`average_price\` decimal(10,2) DEFAULT NULL,
  \`property_count\` int DEFAULT '0',
  \`is_popular\` tinyint(1) DEFAULT '0',
  \`display_order\` int DEFAULT '0',
  \`is_active\` tinyint(1) DEFAULT '1',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`unique_city_locality\` (\`city_id\`,\`slug\`),
  KEY \`idx_city_id\` (\`city_id\`),
  KEY \`idx_slug\` (\`slug\`),
  KEY \`idx_is_popular\` (\`is_popular\`),
  FULLTEXT KEY \`idx_name\` (\`name\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_localities...');
    await pool.query('DROP TABLE IF EXISTS merchant_localities');
}
