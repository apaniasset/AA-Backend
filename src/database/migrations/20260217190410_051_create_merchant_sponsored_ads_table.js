/**
 * Migration for table: merchant_sponsored_ads
 */
export async function up(pool) {
    console.log('Creating table: merchant_sponsored_ads...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_sponsored_ads\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`merchant_id\` int NOT NULL,
  \`property_id\` int DEFAULT NULL,
  \`ad_type\` enum('featured','top_listing','banner') COLLATE utf8mb4_general_ci DEFAULT 'featured',
  \`title\` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`start_date\` date NOT NULL,
  \`end_date\` date NOT NULL,
  \`daily_budget\` decimal(15,2) DEFAULT '0.00',
  \`total_spent\` decimal(15,2) DEFAULT '0.00',
  \`status\` enum('scheduled','running','paused','completed','cancelled') COLLATE utf8mb4_general_ci DEFAULT 'scheduled',
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`merchant_id\` (\`merchant_id\`),
  KEY \`property_id\` (\`property_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_sponsored_ads...');
    await pool.query('DROP TABLE IF EXISTS merchant_sponsored_ads');
}
