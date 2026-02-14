import pool from '../config/db.js';

export class UserModel {
    /**
     * Find user by email or phone with roles and permissions
     */
    static async findByEmailOrMobile(identifier) {
        const [rows] = await pool.query(
            `SELECT u.*, s.name as status_name 
             FROM users u 
             LEFT JOIN statuses s ON u.status_id = s.id
             WHERE (u.email = ? OR u.phone = ?) AND u.is_active = 1`,
            [identifier, identifier]
        );

        if (rows.length === 0) return null;
        const user = rows[0];

        // Fetch User Roles
        const [roles] = await pool.query(
            `SELECT r.id, r.name 
             FROM roles r 
             JOIN user_roles ur ON r.id = ur.role_id 
             WHERE ur.user_id = ?`,
            [user.id]
        );
        user.roles = roles.map(r => r.name);

        // Fetch Permissions (if admin, give all)
        if (user.roles.includes('admin')) {
            const [allPerms] = await pool.query('SELECT name FROM permissions');
            user.permissions = allPerms.map(p => p.name);
        } else {
            const [perms] = await pool.query(
                `SELECT DISTINCT p.name 
                 FROM permissions p 
                 JOIN role_permissions rp ON p.id = rp.permission_id 
                 JOIN user_roles ur ON rp.role_id = ur.role_id 
                 WHERE ur.user_id = ?`,
                [user.id]
            );
            user.permissions = perms.map(p => p.name);
        }

        return user;
    }

    /**
     * Find user by ID with roles and profiles
     */
    static async findById(id) {
        const [rows] = await pool.query(
            `SELECT u.*, s.name as status_name, mp.company_name, ap.referral_code
             FROM users u 
             LEFT JOIN statuses s ON u.status_id = s.id
             LEFT JOIN merchant_profiles mp ON u.id = mp.user_id
             LEFT JOIN affiliate_profiles ap ON u.id = ap.user_id
             WHERE u.id = ?`,
            [id]
        );
        if (rows.length === 0) return null;

        const user = rows[0];
        const [roles] = await pool.query(
            'SELECT r.name FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = ?',
            [user.id]
        );
        user.roles = roles.map(r => r.name);
        return user;
    }

    /**
     * Create new user
     */
    static async create(data) {
        const [result] = await pool.query('INSERT INTO users SET ?', [data]);
        return result.insertId;
    }

    /**
     * Find All Users (Filterable by role)
     */
    static async findAll(filters = {}) {
        let query = `
            SELECT u.id, u.name, u.email, u.phone, u.is_active, s.name as status, 
                   GROUP_CONCAT(r.name) as roles
            FROM users u
            LEFT JOIN statuses s ON u.status_id = s.id
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
        `;
        const params = [];

        if (filters.role) {
            query += ' WHERE r.name = ?';
            params.push(filters.role);
        }

        query += ' GROUP BY u.id';
        const [rows] = await pool.query(query, params);
        return rows;
    }

    /**
     * Update user
     */
    static async update(id, data) {
        const [result] = await pool.query('UPDATE users SET ? WHERE id = ?', [data, id]);
        return result.affectedRows > 0;
    }

    /**
     * Delete user
     */
    static async delete(id) {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    /**
     * Assign Role to User
     */
    static async assignRole(userId, roleName) {
        const [role] = await pool.query('SELECT id FROM roles WHERE name = ?', [roleName]);
        if (role.length > 0) {
            await pool.query('INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, role[0].id]);
        }
    }

    /**
     * Profile Management
     */
    static async updateMerchantProfile(userId, data) {
        await pool.query('INSERT INTO merchant_profiles (user_id, company_name, rera_number, gst_number) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE company_name=VALUES(company_name), rera_number=VALUES(rera_number), gst_number=VALUES(gst_number)',
            [userId, data.company_name, data.rera_number, data.gst_number]);
    }

    static async updateAffiliateProfile(userId, data) {
        await pool.query('INSERT INTO affiliate_profiles (user_id, referral_code) VALUES (?, ?) ON DUPLICATE KEY UPDATE referral_code=VALUES(referral_code)',
            [userId, data.referral_code]);
    }

    /**
     * Update last login/password
     */
    static async updateLastLogin(id) {
        await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [id]);
    }

    static async updatePassword(id, hashedPassword) {
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    }

    static async storeLoginOTP(id, otp) {
        const expires = new Date(Date.now() + 10 * 60 * 1000);
        await pool.query('UPDATE users SET reset_password_otp = ?, reset_password_expires = ? WHERE id = ?', [otp, expires, id]);
    }

    static async verifyLoginOTP(identifier, otp) {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE (email = ? OR phone = ?) AND reset_password_otp = ? AND reset_password_expires > NOW() LIMIT 1',
            [identifier, identifier, otp]
        );
        return rows.length > 0 ? rows[0] : null;
    }
}
