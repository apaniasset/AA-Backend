/**
 * Migration for table: merchant_property_types
 */
export async function up(pool) {
    console.log('Creating table: merchant_property_types...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_property_types\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`name\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`slug\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`description\` text COLLATE utf8mb4_unicode_ci,
  \`icon\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`is_active\` tinyint(1) DEFAULT '1',
  \`display_order\` int DEFAULT '0',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`slug\` (\`slug\`),
  KEY \`idx_slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_property_types...');
    await pool.query('DROP TABLE IF EXISTS merchant_property_types');
}
