/**
 * Migration for table: affiliate_levels
 */
export async function up(pool) {
    console.log('Creating table: affiliate_levels...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`affiliate_levels\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`level_name\` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  \`level_order\` int NOT NULL DEFAULT '1',
  \`min_active_referrals\` int NOT NULL DEFAULT '0',
  \`active_commission_percent\` decimal(5,2) NOT NULL DEFAULT '0.00',
  \`passive_commission_percent\` decimal(5,2) NOT NULL DEFAULT '0.00',
  \`description\` text COLLATE utf8mb4_general_ci,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: affiliate_levels...');
    await pool.query('DROP TABLE IF EXISTS affiliate_levels');
}
