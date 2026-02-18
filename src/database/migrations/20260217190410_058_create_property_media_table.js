/**
 * Migration for table: property_media
 */
export async function up(pool) {
    console.log('Creating table: property_media...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`property_media\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`property_id\` int NOT NULL,
  \`file_path\` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  \`media_type\` enum('image','video','floor_plan','brochure') COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  \`is_cover\` tinyint(1) DEFAULT '0',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`property_id\` (\`property_id\`),
  CONSTRAINT \`property_media_ibfk_1\` FOREIGN KEY (\`property_id\`) REFERENCES \`merchant_properties\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: property_media...');
    await pool.query('DROP TABLE IF EXISTS property_media');
}
