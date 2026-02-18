/**
 * Migration for table: master_states
 */
export async function up(pool) {
    console.log('Creating table: master_states...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`master_states\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`country_id\` bigint unsigned DEFAULT NULL,
  \`state_name\` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  \`state_code\` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`state_type\` enum('State','UT') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'State',
  \`is_active\` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: master_states...');
    await pool.query('DROP TABLE IF EXISTS master_states');
}
