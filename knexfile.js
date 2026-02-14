import dotenv from 'dotenv';
dotenv.config();

const config = {
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: 'govind_apani_asset',
        },
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds',
        },
    },
    // Added a specific config to connect to the old database for migration
    oldDatabase: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'kotekgha_aa_dev_db',
        },
    }
};

export default config;
