import './src/config/env.js';

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        },
        migrations: {
            directory: './src/database/migrations',
            extension: 'js',
            loadExtensions: ['.js'],
            // This is important for ESM support
            stub: './src/database/migration-stub.js'
        },
        seeds: {
            directory: './src/database/seeds'
        }
    }
};
