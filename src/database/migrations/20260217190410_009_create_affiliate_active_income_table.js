/**
 * Migration for table: affiliate_active_income
 */
export async function up(pool) {
    console.log('Creating table: affiliate_active_income...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`affiliate_active_income\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`affiliate_id\` int NOT NULL,
  \`property_id\` int DEFAULT NULL,
  \`merchant_id\` int DEFAULT NULL,
  \`affiliate_lead_id\` int DEFAULT NULL,
  \`deal_amount\` decimal(15,2) NOT NULL,
  \`commission_percent\` decimal(5,2) NOT NULL,
  \`commission_amount\` decimal(15,2) NOT NULL,
  \`status\` enum('pending','approved','paid') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  \`paid_at\` datetime DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`affiliate_id\` (\`affiliate_id\`),
  KEY \`property_id\` (\`property_id\`),
  KEY \`merchant_id\` (\`merchant_id\`),
  KEY \`affiliate_lead_id\` (\`affiliate_lead_id\`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: affiliate_active_income...');
    await pool.query('DROP TABLE IF EXISTS affiliate_active_income');
}
