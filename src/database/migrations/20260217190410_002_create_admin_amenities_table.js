/**
 * Migration for table: admin_amenities
 */
export async function up(pool) {
    console.log('Creating table: admin_amenities...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`admin_amenities\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`name\` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  \`icon\` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`description\` text COLLATE utf8mb4_general_ci,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: admin_amenities...');
    await pool.query('DROP TABLE IF EXISTS admin_amenities');
}
