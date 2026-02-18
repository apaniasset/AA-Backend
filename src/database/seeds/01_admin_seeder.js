import bcrypt from 'bcryptjs';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
    // Deletes ALL existing entries
    // await knex('admin').del();

    const hashedPassword = await bcrypt.hash('password', 10);

    // Insert seed entries
    await knex('admin').insert([
        {
            name: 'Super Admin',
            email: 'admin@test.com',
            password: hashedPassword,
            role: 'superadmin',
            status: 'active'
        }
    ]).onConflict('email').ignore();
};
