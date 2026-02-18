/**
 * Migration for table: merchant_credits
 */
export async function up(pool) {
    console.log('Creating table: merchant_credits...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_credits\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`merchant_id\` int NOT NULL,
  \`credits\` int NOT NULL DEFAULT '0',
  \`source\` enum('free_signup','admin','package') COLLATE utf8mb3_unicode_ci NOT NULL,
  \`reference_id\` int DEFAULT NULL,
  \`used_credits\` int NOT NULL DEFAULT '0',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_signup_credit\` (\`merchant_id\`,\`source\`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_credits...');
    await pool.query('DROP TABLE IF EXISTS merchant_credits');
}
