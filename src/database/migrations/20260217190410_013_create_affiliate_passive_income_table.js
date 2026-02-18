/**
 * Migration for table: affiliate_passive_income
 */
export async function up(pool) {
    console.log('Creating table: affiliate_passive_income...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`affiliate_passive_income\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`affiliate_id\` int NOT NULL,
  \`from_affiliate_id\` int NOT NULL,
  \`active_income_id\` int DEFAULT NULL,
  \`deal_amount\` decimal(15,2) NOT NULL,
  \`commission_percent\` decimal(5,2) NOT NULL,
  \`commission_amount\` decimal(15,2) NOT NULL,
  \`status\` enum('pending','approved','paid') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  \`paid_at\` datetime DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`affiliate_id\` (\`affiliate_id\`),
  KEY \`from_affiliate_id\` (\`from_affiliate_id\`),
  KEY \`active_income_id\` (\`active_income_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: affiliate_passive_income...');
    await pool.query('DROP TABLE IF EXISTS affiliate_passive_income');
}
