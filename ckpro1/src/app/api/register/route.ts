import { NextResponse } from 'next/server';
import { createUser } from '@/utils/employees/createEmployees';

export async function POST(request: Request) {
		try {
				const {
						full_name,
						email,
						password,
						position,
						department_id,
						hire_date,
						secret_key,
						status
				} = await request.json();

				// Secret key validation
				const expectedSecret = process.env.REGISTER_SECRET_KEY;
				if (!expectedSecret) {
						console.error('REGISTER_SECRET_KEY is not configured');
						return NextResponse.json(
								{ error: 'Server configuration error' },
								{ status: 500 }
						);
				}

				if (!secret_key || secret_key !== expectedSecret) {
						return NextResponse.json(
								{ error: 'Invalid or missing secret key' },
								{ status: 403 }
						);
				}

				// Basic validation
				if (!full_name || !password) {
						return NextResponse.json(
								{ error: 'Full name and password are required' },
								{ status: 400 }
						);
				}

				const newUser = await createUser({
						full_name,
						email: email || null,
						password,
						position: position || null,
						department_id: department_id ? Number(department_id) : null,
						hire_date: hire_date || null,
						status: status || 'A',
						created_by: full_name
				});

				return NextResponse.json({
						success: true,
						user: {
								id: newUser.employee_id,
								full_name: newUser.full_name
						}
				});

		} catch (error) {
				return NextResponse.json(
					{ success: false, error: error.message || 'Registration failed'  },
					{ status: 400 }
				);
		}
}