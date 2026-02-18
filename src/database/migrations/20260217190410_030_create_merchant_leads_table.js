/**
 * Migration for table: merchant_leads
 */
export async function up(pool) {
    console.log('Creating table: merchant_leads...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_leads\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`property_id\` int DEFAULT NULL,
  \`merchant_id\` int NOT NULL,
  \`source\` enum('website','affiliate','whatsapp','call','walkin','other') COLLATE utf8mb4_general_ci DEFAULT 'website',
  \`name\` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`email\` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`phone\` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`message\` text COLLATE utf8mb4_general_ci,
  \`note\` text COLLATE utf8mb4_general_ci,
  \`status\` enum('new','contacted','interested','visit_scheduled','not_interested','converted','closed') COLLATE utf8mb4_general_ci DEFAULT 'new',
  \`assigned_to_merchant_id\` int DEFAULT NULL,
  \`affiliate_id\` int DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`property_id\` (\`property_id\`),
  KEY \`merchant_id\` (\`merchant_id\`),
  KEY \`assigned_to_merchant_id\` (\`assigned_to_merchant_id\`),
  KEY \`affiliate_id\` (\`affiliate_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_leads...');
    await pool.query('DROP TABLE IF EXISTS merchant_leads');
}
