/**
 * Migration for table: admin_packages
 */
export async function up(pool) {
    console.log('Creating table: admin_packages...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`admin_packages\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`name\` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  \`slug\` varchar(150) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  \`package_type\` enum('package','leads','bundle') COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'package',
  \`description\` text COLLATE utf8mb3_unicode_ci,
  \`price\` decimal(10,2) NOT NULL,
  \`offer_price\` varchar(200) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  \`property_limit\` int NOT NULL,
  \`featured_limit\` int DEFAULT '0',
  \`leads_limit\` int DEFAULT '0',
  \`validity_days\` int NOT NULL,
  \`status\` enum('active','inactive') COLLATE utf8mb3_unicode_ci DEFAULT 'active',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`slug\` (\`slug\`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: admin_packages...');
    await pool.query('DROP TABLE IF EXISTS admin_packages');
}
