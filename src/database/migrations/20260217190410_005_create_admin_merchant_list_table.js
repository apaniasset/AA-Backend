/**
 * Migration for table: admin_merchant_list
 */
export async function up(pool) {
    console.log('Creating table: admin_merchant_list...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`admin_merchant_list\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`merchant_id\` int NOT NULL,
  \`assigned_admin_id\` int DEFAULT NULL,
  \`status\` enum('pending','approved','rejected','blocked') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  \`verified\` tinyint(1) DEFAULT '0',
  \`remarks\` text COLLATE utf8mb4_general_ci,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`merchant_id\` (\`merchant_id\`),
  KEY \`assigned_admin_id\` (\`assigned_admin_id\`),
  CONSTRAINT \`admin_merchant_list_ibfk_1\` FOREIGN KEY (\`merchant_id\`) REFERENCES \`merchant\` (\`id\`),
  CONSTRAINT \`admin_merchant_list_ibfk_2\` FOREIGN KEY (\`assigned_admin_id\`) REFERENCES \`admin\` (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: admin_merchant_list...');
    await pool.query('DROP TABLE IF EXISTS admin_merchant_list');
}
