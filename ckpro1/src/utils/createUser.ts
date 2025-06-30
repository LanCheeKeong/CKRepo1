import { hashPassword, generateSalt } from '../lib/auth';
import pool from '../lib/db';

interface UserData {
		full_name: string;
		password: string;
		email?: string | null;
		status?: 'A' | 'I';
		position?: string | null;
		department_id?: number | null;
		hire_date?: string | null;
		created_by: string;
}

export async function createUser(userData: UserData) {
		const { 
				full_name, 
				password, 
				email = null, 
				status = 'A',
				position = null,
				department_id = null,
				hire_date = null,
				created_by
		} = userData;
		
		// Validate inputs
		if (!full_name || !password) {
				throw new Error('Full name and password are required');
		}

		const salt = generateSalt();
		const passwordHash = hashPassword(password, salt);

		const client = await pool.connect();
		
		try {
				const result = await client.query(
						`INSERT INTO t_user_mstr (
								full_name,
								password,
								salt,
								email,
								status,
								position,
								department_id,
								hire_date,
								created_by,
								created_at
						) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
						RETURNING employee_id, full_name`,
						[
								full_name,
								passwordHash,
								salt,
								email,
								status,
								position,
								department_id,
								hire_date,
								created_by
						]
				);

				if (result.rows.length === 0) {
						throw new Error('User creation failed - no data returned');
				}

				return result.rows[0];
		} catch (error: any) {
				// Handle duplicate username/email
				if (error.code === '23505') {
						if (error.constraint.includes('full_name')) {
								throw new Error('Full name already exists');
						}
						if (error.constraint.includes('email')) {
								throw new Error('Email already registered');
						}
				}
				console.error('User creation error:', error);
				throw new Error('Failed to create user');
		} finally {
				client.release();
		}
}