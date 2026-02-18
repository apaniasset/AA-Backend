/**
 * Migration for table: merchant_locations
 */
export async function up(pool) {
    console.log('Creating table: merchant_locations...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_locations\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`merchant_id\` int NOT NULL,
  \`city\` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  \`area\` varchar(150) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  \`is_active\` tinyint(1) DEFAULT '1',
  \`created_at\` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`merchant_id\` (\`merchant_id\`),
  KEY \`city\` (\`city\`),
  KEY \`area\` (\`area\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_locations...');
    await pool.query('DROP TABLE IF EXISTS merchant_locations');
}
