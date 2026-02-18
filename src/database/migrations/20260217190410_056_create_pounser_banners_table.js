/**
 * Migration for table: pounser_banners
 */
export async function up(pool) {
    console.log('Creating table: pounser_banners...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`pounser_banners\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`is_merchant\` tinyint(1) NOT NULL COMMENT '1 = merchant, 0 = non-merchant',
  \`merchant_id\` int DEFAULT NULL,
  \`name\` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`city\` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`area\` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`image\` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: pounser_banners...');
    await pool.query('DROP TABLE IF EXISTS pounser_banners');
}
