/**
 * Migration for table: leads_master
 */
export async function up(pool) {
    console.log('Creating table: leads_master...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`leads_master\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`name\` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  \`contact_no\` varchar(20) COLLATE utf8mb3_unicode_ci NOT NULL,
  \`country\` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT 'India',
  \`state\` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  \`city\` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  \`area\` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  \`nearby_area\` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  \`source\` enum('admin','website','campaign') COLLATE utf8mb3_unicode_ci DEFAULT 'admin',
  \`status\` enum('new','assigned','closed') COLLATE utf8mb3_unicode_ci DEFAULT 'new',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: leads_master...');
    await pool.query('DROP TABLE IF EXISTS leads_master');
}
