/**
 * Migration for table: merchant_transactions
 */
export async function up(pool) {
    console.log('Creating table: merchant_transactions...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`merchant_transactions\` (
  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`user_id\` bigint unsigned NOT NULL,
  \`subscription_id\` bigint unsigned DEFAULT NULL,
  \`transaction_id\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  \`payment_gateway\` enum('razorpay','paytm','phonepe','stripe','paypal','bank_transfer','cash') COLLATE utf8mb4_unicode_ci NOT NULL,
  \`payment_method\` enum('credit_card','debit_card','upi','net_banking','wallet','cash') COLLATE utf8mb4_unicode_ci NOT NULL,
  \`amount\` decimal(10,2) NOT NULL,
  \`currency\` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'INR',
  \`status\` enum('pending','processing','completed','failed','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  \`gateway_response\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  \`invoice_number\` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`invoice_url\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  \`refund_amount\` decimal(10,2) DEFAULT NULL,
  \`refund_date\` timestamp NULL DEFAULT NULL,
  \`refund_reason\` text COLLATE utf8mb4_unicode_ci,
  \`notes\` text COLLATE utf8mb4_unicode_ci,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`transaction_id\` (\`transaction_id\`),
  KEY \`subscription_id\` (\`subscription_id\`),
  KEY \`idx_user_id\` (\`user_id\`),
  KEY \`idx_transaction_id\` (\`transaction_id\`),
  KEY \`idx_status\` (\`status\`),
  KEY \`idx_created_at\` (\`created_at\`),
  CONSTRAINT \`merchant_transactions_chk_1\` CHECK (json_valid(\`gateway_response\`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: merchant_transactions...');
    await pool.query('DROP TABLE IF EXISTS merchant_transactions');
}
