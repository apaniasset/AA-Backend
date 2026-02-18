/**
 * Migration for table: merchant_orders
 */
export async function up(pool) {
    console.log('Creating table: merchant_orders...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_orders\` (
  \`id\` int unsigned NOT NULL AUTO_INCREMENT,
  \`merchant_id\` int unsigned NOT NULL,
  \`plan_id\` int unsigned DEFAULT NULL,
  \`amount\` decimal(12,2) NOT NULL,
  \`currency\` varchar(10) COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'INR',
  \`status\` enum('pending','paid','failed','cancelled','refunded') COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'pending',
  \`payment_method\` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  \`gateway_order_id\` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  \`gateway_payment_id\` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  \`notes\` text COLLATE utf8mb3_unicode_ci,
  \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`paid_at\` datetime DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_mo_merchant\` (\`merchant_id\`),
  KEY \`idx_mo_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_orders...');
    await pool.query('DROP TABLE IF EXISTS merchant_orders');
}
