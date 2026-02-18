/**
 * Migration for table: property_amenities
 */
export async function up(pool) {
    console.log('Creating table: property_amenities...');
    await pool.query(`
CREATE TABLE IF NOT EXISTS \`property_amenities\` (
  \`property_id\` int NOT NULL,
  \`amenity_id\` int NOT NULL,
  PRIMARY KEY (\`property_id\`,\`amenity_id\`),
  CONSTRAINT \`property_amenities_ibfk_1\` FOREIGN KEY (\`property_id\`) REFERENCES \`merchant_properties\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci
    `);
}

export async function down(pool) {
    console.log('Dropping table: property_amenities...');
    await pool.query('DROP TABLE IF EXISTS property_amenities');
}
