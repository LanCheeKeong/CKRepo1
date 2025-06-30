import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { verifyPassword, UserStatus } from '../../../lib/auth';


export async function POST(request: Request) {
		const { employeeID, password } = await request.json();
		const id = Number(employeeID);

		// Validate employeeID
		if (!Number.isInteger(id) || id <= 0) {
				return NextResponse.json(
						{ error: 'Invalid employee ID' },
						{ status: 400 }
				);
		}

		try {
				const client = await pool.connect();
				
				// Find active user
				const result = await client.query(
						'SELECT * FROM t_user_mstr WHERE employee_id = $1 AND status = $2',
						[id, UserStatus.ACTIVE]
				);

				if (result.rows.length === 0) {
						client.release();
						return NextResponse.json(
								{ error: 'Invalid credentials or inactive account' },
								{ status: 401 }
						);
				}

				const user = result.rows[0];

				// Verify password
				const isValid = verifyPassword(password, user.password, user.salt);
				if (!isValid) {
						client.release();
						return NextResponse.json(
								{ error: 'Invalid credentials' },
								{ status: 401 }
						);
				}

				// Update last login time
				await client.query(
						'UPDATE t_user_mstr SET last_login = NOW() WHERE employee_id = $1',
						[id]
				);

				client.release();

				// Create response
				const response = NextResponse.json({
						success: true,
						user: {
								employeeID: user.employee_id,
								name: user.name,
								email: user.email,
								role: user.role,
								status: user.status
						}
				});

				return response;

		} catch (error) {
				console.error('Login error:', error);
				return NextResponse.json(
						{ error: 'Internal server error' },
						{ status: 500 }
				);
		}
}