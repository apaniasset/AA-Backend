/**
 * Migration for table: leads
 */
export async function up(pool) {
    console.log('Creating table: leads...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`leads\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`merchant_id\` int NOT NULL,
  \`property_id\` int NOT NULL,
  \`lead_name\` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  \`lead_phone\` varchar(20) COLLATE utf8mb3_unicode_ci NOT NULL,
  \`lead_email\` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  \`message\` text COLLATE utf8mb3_unicode_ci,
  \`source\` enum('website','whatsapp','call','facebook','instagram','google') COLLATE utf8mb3_unicode_ci DEFAULT 'website',
  \`status\` enum('new','contacted','qualified','site_visit','converted','closed') COLLATE utf8mb3_unicode_ci DEFAULT 'new',
  \`is_locked\` tinyint(1) DEFAULT '0',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`assigned_by\` enum('admin','system','merchant') COLLATE utf8mb3_unicode_ci DEFAULT 'admin',
  \`assigned_at\` datetime DEFAULT NULL,
  \`city\` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  \`area\` varchar(150) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`merchant_id\` (\`merchant_id\`),
  KEY \`property_id\` (\`property_id\`),
  CONSTRAINT \`fk_leads_merchant\` FOREIGN KEY (\`merchant_id\`) REFERENCES \`merchant\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_leads_property\` FOREIGN KEY (\`property_id\`) REFERENCES \`merchant_properties\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: leads...');
    await pool.query('DROP TABLE IF EXISTS leads');
}
