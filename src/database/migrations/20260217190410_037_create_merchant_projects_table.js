/**
 * Migration for table: merchant_projects
 */
export async function up(pool) {
    console.log('Creating table: merchant_projects...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_projects\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`builder_id\` bigint unsigned NOT NULL,
  \`name\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`slug\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`description\` text COLLATE utf8mb4_unicode_ci,
  \`project_type\` enum('residential','commercial','mixed') COLLATE utf8mb4_unicode_ci DEFAULT 'residential',
  \`status\` enum('upcoming','ongoing','completed','ready_to_move') COLLATE utf8mb4_unicode_ci DEFAULT 'ongoing',
  \`rera_number\` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`rera_approved\` tinyint(1) DEFAULT '0',
  \`launch_date\` date DEFAULT NULL,
  \`possession_date\` date DEFAULT NULL,
  \`total_units\` int DEFAULT NULL,
  \`available_units\` int DEFAULT NULL,
  \`total_towers\` int DEFAULT NULL,
  \`total_floors\` int DEFAULT NULL,
  \`min_price\` decimal(15,2) DEFAULT NULL,
  \`max_price\` decimal(15,2) DEFAULT NULL,
  \`address\` text COLLATE utf8mb4_unicode_ci,
  \`city\` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`locality\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`pincode\` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`latitude\` decimal(10,8) DEFAULT NULL,
  \`longitude\` decimal(11,8) DEFAULT NULL,
  \`brochure_url\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`video_url\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`virtual_tour_url\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`rating_average\` decimal(3,2) DEFAULT '0.00',
  \`total_reviews\` int DEFAULT '0',
  \`view_count\` int DEFAULT '0',
  \`is_featured\` tinyint(1) DEFAULT '0',
  \`is_active\` tinyint(1) DEFAULT '1',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`slug\` (\`slug\`),
  KEY \`idx_builder_id\` (\`builder_id\`),
  KEY \`idx_slug\` (\`slug\`),
  KEY \`idx_city\` (\`city\`),
  KEY \`idx_status\` (\`status\`),
  FULLTEXT KEY \`idx_search\` (\`name\`,\`description\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_projects...');
    await pool.query('DROP TABLE IF EXISTS merchant_projects');
}
