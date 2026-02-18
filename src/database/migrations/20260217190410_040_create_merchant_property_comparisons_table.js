/**
 * Migration for table: merchant_property_comparisons
 */
export async function up(pool) {
    console.log('Creating table: merchant_property_comparisons...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_property_comparisons\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`user_id\` bigint unsigned NOT NULL,
  \`property_ids\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  \`comparison_name\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_user_id\` (\`user_id\`),
  CONSTRAINT \`merchant_property_comparisons_chk_1\` CHECK (json_valid(\`property_ids\`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_property_comparisons...');
    await pool.query('DROP TABLE IF EXISTS merchant_property_comparisons');
}
