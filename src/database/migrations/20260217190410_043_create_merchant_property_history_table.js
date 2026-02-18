/**
 * Migration for table: merchant_property_history
 */
export async function up(pool) {
    console.log('Creating table: merchant_property_history...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_property_history\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`property_id\` bigint unsigned NOT NULL,
  \`changed_by\` bigint unsigned DEFAULT NULL,
  \`field_name\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`old_value\` text COLLATE utf8mb4_unicode_ci,
  \`new_value\` text COLLATE utf8mb4_unicode_ci,
  \`change_type\` enum('created','updated','deleted','price_change','status_change') COLLATE utf8mb4_unicode_ci NOT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`changed_by\` (\`changed_by\`),
  KEY \`idx_property_id\` (\`property_id\`),
  KEY \`idx_created_at\` (\`created_at\`),
  KEY \`idx_change_type\` (\`change_type\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_property_history...');
    await pool.query('DROP TABLE IF EXISTS merchant_property_history');
}
