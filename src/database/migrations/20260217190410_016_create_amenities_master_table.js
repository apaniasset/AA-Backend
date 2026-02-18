/**
 * Migration for table: amenities_master
 */
export async function up(pool) {
    console.log('Creating table: amenities_master...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`amenities_master\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`name\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`slug\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`icon\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`category\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`description\` text COLLATE utf8mb4_unicode_ci,
  \`is_active\` tinyint(1) DEFAULT '1',
  \`display_order\` int DEFAULT '0',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`slug\` (\`slug\`),
  KEY \`idx_category\` (\`category\`),
  KEY \`idx_slug\` (\`slug\`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: amenities_master...');
    await pool.query('DROP TABLE IF EXISTS amenities_master');
}
