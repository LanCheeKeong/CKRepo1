import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyPassword, UserStatus } from '@/lib/auth';

export async function POST(request: Request) {
	const { name, password } = await request.json();

	try {
		const client = await pool.connect();
		
		// Find active user by name
		const result = await client.query(
			'SELECT * FROM T_USER_MSTR WHERE name = $1 AND status = $2',
			[name, UserStatus.ACTIVE]
		);

		if (result.rows.length === 0) {
			return NextResponse.json(
				{ error: 'Invalid credentials or inactive account' },
				{ status: 401 }
			);
		}

		const user = result.rows[0];

		// Verify password
		const isValid = verifyPassword(password, user.password, user.salt);

		if (!isValid) {
			return NextResponse.json(
				{ error: 'Invalid credentials' },
				{ status: 401 }
			);
		}

		// Update last login time
		await client.query(
			'UPDATE T_USER_MSTR SET last_login = NOW() WHERE employeeID = $1',
			[user.employeeID]
		);

		client.release();

		return NextResponse.json({
			success: true,
			user: {
				employeeID: user.employeeID,
				name: user.name,
				email: user.email,
				status: user.status
			}
		});

	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}