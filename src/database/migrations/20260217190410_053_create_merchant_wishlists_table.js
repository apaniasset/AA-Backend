/**
 * Migration for table: merchant_wishlists
 */
export async function up(pool) {
    console.log('Creating table: merchant_wishlists...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_wishlists\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`user_id\` bigint unsigned NOT NULL,
  \`property_id\` bigint unsigned NOT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`unique_wishlist\` (\`user_id\`,\`property_id\`),
  KEY \`idx_user_id\` (\`user_id\`),
  KEY \`idx_property_id\` (\`property_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_wishlists...');
    await pool.query('DROP TABLE IF EXISTS merchant_wishlists');
}
