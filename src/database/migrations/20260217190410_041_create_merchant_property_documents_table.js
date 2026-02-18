/**
 * Migration for table: merchant_property_documents
 */
export async function up(pool) {
    console.log('Creating table: merchant_property_documents...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_property_documents\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`property_id\` bigint unsigned NOT NULL,
  \`document_type\` enum('sale_deed','title_deed','khata_certificate','tax_receipt','noc','building_plan','occupancy_certificate','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  \`document_name\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`document_url\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`document_number\` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`issued_date\` date DEFAULT NULL,
  \`expiry_date\` date DEFAULT NULL,
  \`is_verified\` tinyint(1) DEFAULT '0',
  \`verified_at\` timestamp NULL DEFAULT NULL,
  \`verified_by\` bigint unsigned DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`verified_by\` (\`verified_by\`),
  KEY \`idx_property_id\` (\`property_id\`),
  KEY \`idx_document_type\` (\`document_type\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_property_documents...');
    await pool.query('DROP TABLE IF EXISTS merchant_property_documents');
}
