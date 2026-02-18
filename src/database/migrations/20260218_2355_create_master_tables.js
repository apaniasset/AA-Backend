import pool from '../../config/db.js';

const up = async () => {
    try {
        console.log('--- Starting Master Tables Migration ---');

        // 1. Countries
        await pool.query(`
            CREATE TABLE IF NOT EXISTS countries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                code VARCHAR(10),
                phonecode VARCHAR(10),
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log(' - countries table ready');

        // 2. States
        await pool.query(`
            CREATE TABLE IF NOT EXISTS states (
                id INT AUTO_INCREMENT PRIMARY KEY,
                country_id INT NOT NULL,
                name VARCHAR(100) NOT NULL,
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
            )
        `);
        console.log(' - states table ready');

        // 3. Cities
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cities (
                id INT AUTO_INCREMENT PRIMARY KEY,
                state_id INT NOT NULL,
                name VARCHAR(100) NOT NULL,
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
            )
        `);
        console.log(' - cities table ready');

        // 4. Locations (Areas)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS locations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                city_id INT NOT NULL,
                name VARCHAR(100) NOT NULL,
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
            )
        `);
        console.log(' - locations table ready');

        console.log('--- Master Tables Migration Completed ---');
        process.exit(0);
    } catch (e) {
        console.error('!!! Migration Failed:', e);
        process.exit(1);
    }
};

up();
