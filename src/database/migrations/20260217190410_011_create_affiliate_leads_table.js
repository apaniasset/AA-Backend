/**
 * Migration for table: affiliate_leads
 */
export async function up(pool) {
    console.log('Creating table: affiliate_leads...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`affiliate_leads\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`affiliate_id\` int NOT NULL,
  \`lead_type\` enum('buyer','seller','property') COLLATE utf8mb4_general_ci DEFAULT 'buyer',
  \`property_id\` int DEFAULT NULL,
  \`merchant_id\` int DEFAULT NULL,
  \`name\` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`email\` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`phone\` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`message\` text COLLATE utf8mb4_general_ci,
  \`status\` enum('new','shared_with_merchant','converted','rejected') COLLATE utf8mb4_general_ci DEFAULT 'new',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`affiliate_id\` (\`affiliate_id\`),
  KEY \`property_id\` (\`property_id\`),
  KEY \`merchant_id\` (\`merchant_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: affiliate_leads...');
    await pool.query('DROP TABLE IF EXISTS affiliate_leads');
}
