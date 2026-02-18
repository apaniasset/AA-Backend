/**
 * Migration for table: affiliate_withdrawals
 */
export async function up(pool) {
    console.log('Creating table: affiliate_withdrawals...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`affiliate_withdrawals\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`affiliate_id\` int unsigned NOT NULL,
  \`amount\` decimal(12,2) NOT NULL,
  \`method\` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  \`details\` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  \`status\` enum('pending','approved','paid','rejected') COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'pending',
  \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`processed_at\` datetime DEFAULT NULL,
  \`admin_note\` varchar(255) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_aw_affiliate\` (\`affiliate_id\`),
  KEY \`idx_aw_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: affiliate_withdrawals...');
    await pool.query('DROP TABLE IF EXISTS affiliate_withdrawals');
}
