/**
 * Migration for table: master_cities
 */
export async function up(pool) {
    console.log('Creating table: master_cities...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`master_cities\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`state_id\` int NOT NULL,
  \`city_name\` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  \`is_active\` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (\`id\`),
  KEY \`state_id\` (\`state_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: master_cities...');
    await pool.query('DROP TABLE IF EXISTS master_cities');
}
