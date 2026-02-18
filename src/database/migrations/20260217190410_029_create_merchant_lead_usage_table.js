/**
 * Migration for table: merchant_lead_usage
 */
export async function up(pool) {
    console.log('Creating table: merchant_lead_usage...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_lead_usage\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`merchant_id\` int NOT NULL,
  \`package_id\` int NOT NULL,
  \`used\` int DEFAULT '0',
  \`limit_count\` int NOT NULL,
  \`status\` enum('active','expired') COLLATE utf8mb3_unicode_ci NOT NULL,
  \`expires_at\` datetime NOT NULL,
  \`created_at\` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_lead_usage...');
    await pool.query('DROP TABLE IF EXISTS merchant_lead_usage');
}
