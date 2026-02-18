/**
 * Migration for table: admin_invoices
 */
export async function up(pool) {
    console.log('Creating table: admin_invoices...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`admin_invoices\` (
  \`id\` int NOT NULL AUTO_INCREMENT,
  \`invoice_no\` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  \`merchant_id\` int NOT NULL,
  \`package_id\` int DEFAULT NULL,
  \`subtotal\` decimal(15,2) NOT NULL,
  \`tax_amount\` decimal(15,2) NOT NULL DEFAULT '0.00',
  \`total_amount\` decimal(15,2) NOT NULL,
  \`status\` enum('unpaid','paid','cancelled','refunded') COLLATE utf8mb4_general_ci DEFAULT 'unpaid',
  \`due_date\` date DEFAULT NULL,
  \`paid_at\` datetime DEFAULT NULL,
  \`notes\` text COLLATE utf8mb4_general_ci,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`invoice_no\` (\`invoice_no\`),
  KEY \`merchant_id\` (\`merchant_id\`),
  KEY \`package_id\` (\`package_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: admin_invoices...');
    await pool.query('DROP TABLE IF EXISTS admin_invoices');
}
