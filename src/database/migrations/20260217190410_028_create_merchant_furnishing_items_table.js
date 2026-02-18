/**
 * Migration for table: merchant_furnishing_items
 */
export async function up(pool) {
    console.log('Creating table: merchant_furnishing_items...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_furnishing_items\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`name\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`slug\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`icon\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`category\` enum('living_room','bedroom','kitchen','bathroom','other') COLLATE utf8mb4_unicode_ci DEFAULT 'other',
  \`is_active\` tinyint(1) DEFAULT '1',
  \`display_order\` int DEFAULT '0',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`slug\` (\`slug\`),
  KEY \`idx_category\` (\`category\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_furnishing_items...');
    await pool.query('DROP TABLE IF EXISTS merchant_furnishing_items');
}
