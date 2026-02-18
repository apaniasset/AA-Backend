/**
 * Migration for table: master_countries
 */
export async function up(pool) {
    console.log('Creating table: master_countries...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`master_countries\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`name\` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  \`short_name\` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`country_code\` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`is_active\` tinyint(1) NOT NULL DEFAULT '1',
  \`created_at\` timestamp NULL DEFAULT NULL,
  \`updated_at\` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: master_countries...');
    await pool.query('DROP TABLE IF EXISTS master_countries');
}
