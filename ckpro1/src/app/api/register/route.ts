import { NextResponse } from 'next/server';
import { createUser } from '@/utils/createUser';

export async function POST(request: Request) {
	try {
		const { name, password, email } = await request.json();

		// Basic validation
		if (!name || !password) {
			return NextResponse.json(
				{ error: 'Username and password are required' },
				{ status: 400 }
			);
		}

		const newUser = await createUser({
			name,
			password,
			email,
			status: 'A' // Default to Active
		});

		return NextResponse.json({
			success: true,
			user: {
				id: newUser.employeeid,
				name: newUser.name,
				email: newUser.email
			}
		});

	} catch (error: any) {
		return NextResponse.json(
			{ 
				success: false, 
				error: error.message || 'Registration failed' 
			},
			{ status: 400 }
		);
	}
}