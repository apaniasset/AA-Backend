/**
 * Migration for table: master_areas
 */
export async function up(pool) {
    console.log('Creating table: master_areas...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`master_areas\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`city_id\` bigint unsigned NOT NULL,
  \`area_name\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`pincode\` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`is_active\` tinyint(1) NOT NULL DEFAULT '1',
  \`created_at\` timestamp NULL DEFAULT NULL,
  \`updated_at\` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`master_areas_city_id_area_name_unique\` (\`city_id\`,\`area_name\`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: master_areas...');
    await pool.query('DROP TABLE IF EXISTS master_areas');
}
