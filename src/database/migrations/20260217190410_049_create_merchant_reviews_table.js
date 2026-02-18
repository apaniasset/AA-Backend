/**
 * Migration for table: merchant_reviews
 */
export async function up(pool) {
    console.log('Creating table: merchant_reviews...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_reviews\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`merchant_id\` int NOT NULL,
  \`reviewer_name\` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`reviewer_email\` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`rating\` tinyint NOT NULL,
  \`title\` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`review_text\` text COLLATE utf8mb4_general_ci,
  \`approved\` tinyint(1) DEFAULT '0',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`merchant_id\` (\`merchant_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_reviews...');
    await pool.query('DROP TABLE IF EXISTS merchant_reviews');
}
