
import pool from './src/config/db.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
    try {
        console.log('--- Starting Database Seeding ---');

        const hashedPassword = await bcrypt.hash('password123', 10);

        // --- 1. Seed Admin ---
        console.log('Seeding Admin...');
        const [adminExists] = await pool.query('SELECT id FROM admin WHERE email = ?', ['admin@example.com']);
        if (adminExists.length === 0) {
            await pool.query(`
                INSERT INTO admin (name, email, password, phone, role, status)
                VALUES (?, ?, ?, ?, ?, ?)
            `, ['Super Admin', 'admin@example.com', hashedPassword, '1234567890', 'superadmin', 'active']);
            console.log(' - Admin created: admin@example.com / password123');
        } else {
            console.log(' - Admin already exists.');
        }

        // --- 2. Seed Merchant ---
        console.log('Seeding Merchant...');
        const [merchantExists] = await pool.query('SELECT id FROM merchant WHERE email = ?', ['merchant@example.com']);
        if (merchantExists.length === 0) {
            await pool.query(`
                INSERT INTO merchant (merchant_type, name, email, password, phone, status)
                VALUES (?, ?, ?, ?, ?, ?)
            `, ['owner', 'Test Merchant', 'merchant@example.com', hashedPassword, '9876543210', 'active']);
            console.log(' - Merchant created: merchant@example.com / password123');
        } else {
            console.log(' - Merchant already exists.');
        }

        // --- 3. Seed Affiliate ---
        console.log('Seeding Affiliate...');
        const [affiliateExists] = await pool.query('SELECT id FROM affiliate WHERE email = ?', ['affiliate@example.com']);
        if (affiliateExists.length === 0) {
            // Generate unique referral code
            const referralCode = 'AA' + Math.random().toString(36).substring(2, 8).toUpperCase();

            await pool.query(`
                INSERT INTO affiliate (name, email, password, phone, referral_code, status, total_active_income, total_passive_income)
                VALUES (?, ?, ?, ?, ?, ?, 0, 0)
            `, ['Test Affiliate', 'affiliate@example.com', hashedPassword, '5555555555', referralCode, 'active']);
            console.log(` - Affiliate created: affiliate@example.com / password123 (Ref: ${referralCode})`);
        } else {
            console.log(' - Affiliate already exists.');
        }

        // --- 4. Seed User ---
        console.log('Seeding User...');
        const [userExists] = await pool.query('SELECT id FROM users WHERE email = ?', ['user@example.com']);
        if (userExists.length === 0) {
            await pool.query(`
                INSERT INTO users (name, email, password, phone, role, status)
                VALUES (?, ?, ?, ?, ?, ?)
            `, ['Test User', 'user@example.com', hashedPassword, '1112223333', 'user', 'active']);
            console.log(' - User created: user@example.com / password123');
        } else {
            console.log(' - User already exists.');
        }

        console.log('--- Seeding Completed Successfully ---');
        process.exit(0);
    } catch (error) {
        console.error('!!! Seeding Failed:', error);
        process.exit(1);
    }
};

seed();
