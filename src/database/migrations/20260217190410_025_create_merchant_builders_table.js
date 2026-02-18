/**
 * Migration for table: merchant_builders
 */
export async function up(pool) {
    console.log('Creating table: merchant_builders...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_builders\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`user_id\` bigint unsigned DEFAULT NULL,
  \`name\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`logo\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`description\` text COLLATE utf8mb4_unicode_ci,
  \`rera_number\` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`rera_verified\` tinyint(1) DEFAULT '0',
  \`established_year\` int DEFAULT NULL,
  \`total_projects\` int DEFAULT '0',
  \`ongoing_projects\` int DEFAULT '0',
  \`completed_projects\` int DEFAULT '0',
  \`website\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`email\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`phone\` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`address\` text COLLATE utf8mb4_unicode_ci,
  \`city\` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`rating_average\` decimal(3,2) DEFAULT '0.00',
  \`total_reviews\` int DEFAULT '0',
  \`is_verified\` tinyint(1) DEFAULT '0',
  \`is_active\` tinyint(1) DEFAULT '1',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`slug\` (\`slug\`),
  KEY \`user_id\` (\`user_id\`),
  KEY \`idx_slug\` (\`slug\`),
  KEY \`idx_rera_number\` (\`rera_number\`),
  FULLTEXT KEY \`idx_name\` (\`name\`,\`description\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_builders...');
    await pool.query('DROP TABLE IF EXISTS merchant_builders');
}
