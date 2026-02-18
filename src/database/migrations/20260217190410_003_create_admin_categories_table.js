/**
 * Migration for table: admin_categories
 */
export async function up(pool) {
    console.log('Creating table: admin_categories...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`admin_categories\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`name\` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  \`slug\` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`parent_id\` int DEFAULT NULL,
  \`description\` text COLLATE utf8mb4_general_ci,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`slug\` (\`slug\`),
  KEY \`parent_id\` (\`parent_id\`),
  CONSTRAINT \`admin_categories_ibfk_1\` FOREIGN KEY (\`parent_id\`) REFERENCES \`admin_categories\` (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: admin_categories...');
    await pool.query('DROP TABLE IF EXISTS admin_categories');
}
