/**
 * Migration for table: affiliate_commission_rules
 */
export async function up(pool) {
    console.log('Creating table: affiliate_commission_rules...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`affiliate_commission_rules\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`basis\` enum('new','renewal') COLLATE utf8mb3_unicode_ci NOT NULL,
  \`level\` tinyint NOT NULL COMMENT '1 = Active, 2 = Passive',
  \`commission_percent\` decimal(5,2) NOT NULL,
  \`status\` enum('active','inactive') COLLATE utf8mb3_unicode_ci DEFAULT 'active',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_basis_level\` (\`basis\`,\`level\`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: affiliate_commission_rules...');
    await pool.query('DROP TABLE IF EXISTS affiliate_commission_rules');
}
