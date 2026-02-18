/**
 * Migration for table: merchant_packages
 */
export async function up(pool) {
    console.log('Creating table: merchant_packages...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_packages\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`merchant_id\` int NOT NULL,
  \`package_id\` int NOT NULL,
  \`package_type\` enum('package','leads','bundle') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'package',
  \`invoice_id\` int DEFAULT NULL,
  \`start_date\` date NOT NULL,
  \`end_date\` date NOT NULL,
  \`total_properties\` int DEFAULT '0',
  \`used_properties\` int DEFAULT '0',
  \`total_featured\` int DEFAULT '0',
  \`used_featured\` int DEFAULT '0',
  \`total_leads\` int DEFAULT '0',
  \`used_leads\` int DEFAULT '0',
  \`amount_paid\` decimal(15,2) NOT NULL,
  \`payment_status\` enum('pending','paid','failed','refunded') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  \`status\` enum('pending','active','expired','rejected') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  \`admin_remark\` text COLLATE utf8mb4_general_ci,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`merchant_id\` (\`merchant_id\`),
  KEY \`package_id\` (\`package_id\`),
  KEY \`invoice_id\` (\`invoice_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_packages...');
    await pool.query('DROP TABLE IF EXISTS merchant_packages');
}
