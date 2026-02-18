/**
 * Migration for table: packages
 */
export async function up(pool) {
    console.log('Creating table: packages...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`packages\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`package_type\` enum('package','bundle','leads') COLLATE utf8mb4_unicode_ci NOT NULL,
  \`package_name\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`plan_name\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`description\` text COLLATE utf8mb4_unicode_ci,
  \`price\` decimal(10,2) NOT NULL,
  \`offer_price\` decimal(10,2) DEFAULT NULL,
  \`property_limit\` int DEFAULT '0',
  \`featured_limit\` int DEFAULT '0',
  \`leads_limit\` int DEFAULT '0',
  \`validity_days\` int NOT NULL,
  \`status\` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: packages...');
    await pool.query('DROP TABLE IF EXISTS packages');
}
