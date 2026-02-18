/**
 * Migration for table: commission_rates
 */
export async function up(pool) {
    console.log('Creating table: commission_rates...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`commission_rates\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`basis\` enum('new','renewal') COLLATE utf8mb3_unicode_ci NOT NULL,
  \`level\` tinyint NOT NULL,
  \`income_type\` enum('active','passive') COLLATE utf8mb3_unicode_ci NOT NULL,
  \`rate\` decimal(5,2) NOT NULL,
  \`status\` tinyint DEFAULT '1',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_commission\` (\`basis\`,\`level\`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: commission_rates...');
    await pool.query('DROP TABLE IF EXISTS commission_rates');
}
