import { hashPassword, generateSalt } from '@/lib/auth';
import pool from '@/lib/db';

interface UserData {
	name: string;
	password: string;
	email?: string;
	status?: 'A' | 'I'; // A=Active, I=Inactive
}

export async function createUser(userData: UserData) {
	const { name, password, email, status = 'A' } = userData;
	
	// Validate inputs
	if (!name || !password) {
		throw new Error('Username and password are required');
	}

	const salt = generateSalt();
	const passwordHash = hashPassword(password, salt);

	const client = await pool.connect();
	
	try {
		const result = await client.query(
			`INSERT INTO T_USER_MSTR (
				name,
				password,
				salt,
				email,
				status,
				created_at
			) VALUES ($1, $2, $3, $4, $5, NOW())
			RETURNING employeeID, name, email, status`,
			[name, passwordHash, salt, email, status]
		);

		return result.rows[0];
	} catch (error: any) {
		// Handle duplicate username/email
		if (error.code === '23505') {
			if (error.constraint.includes('name')) {
				throw new Error('Name already exists');
			}
			if (error.constraint.includes('email')) {
				throw new Error('Email already registered');
			}
		}
		throw error;
	} finally {
		client.release();
	}
}