/**
 * Migration for table: admin_merchant_packages
 */
export async function up(pool) {
    console.log('Creating table: admin_merchant_packages...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`admin_merchant_packages\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`merchant_id\` int NOT NULL,
  \`package_id\` int NOT NULL,
  \`start_date\` date NOT NULL,
  \`end_date\` date NOT NULL,
  \`total_properties\` int NOT NULL,
  \`used_properties\` int DEFAULT '0',
  \`total_featured\` int DEFAULT '0',
  \`total_leads\` int DEFAULT '0',
  \`used_leads\` int DEFAULT '0',
  \`used_featured\` int DEFAULT '0',
  \`status\` enum('pending','active','expired','rejected','cancelled') COLLATE utf8mb3_unicode_ci DEFAULT 'pending',
  \`admin_remark\` text COLLATE utf8mb3_unicode_ci,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`payment_proof\` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  \`payment_note\` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  \`payment_uploaded_at\` datetime DEFAULT NULL,
  \`invoice_number\` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  \`invoice_date\` date DEFAULT NULL,
  \`package_type\` enum('property','lead') COLLATE utf8mb3_unicode_ci DEFAULT 'property',
  PRIMARY KEY (\`id\`),
  KEY \`merchant_id\` (\`merchant_id\`),
  KEY \`package_id\` (\`package_id\`),
  CONSTRAINT \`admin_merchant_packages_ibfk_1\` FOREIGN KEY (\`merchant_id\`) REFERENCES \`merchant\` (\`id\`),
  CONSTRAINT \`admin_merchant_packages_ibfk_2\` FOREIGN KEY (\`package_id\`) REFERENCES \`admin_packages\` (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: admin_merchant_packages...');
    await pool.query('DROP TABLE IF EXISTS admin_merchant_packages');
}
