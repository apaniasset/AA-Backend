/**
 * Migration for table: merchant_property_images
 */
export async function up(pool) {
    console.log('Creating table: merchant_property_images...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_property_images\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`property_id\` int NOT NULL,
  \`image_url\` varchar(191) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`image_type\` varchar(191) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`is_primary\` tinyint NOT NULL DEFAULT '0',
  \`display_order\` int NOT NULL DEFAULT '0',
  \`filename\` varchar(191) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_property_images...');
    await pool.query('DROP TABLE IF EXISTS merchant_property_images');
}
