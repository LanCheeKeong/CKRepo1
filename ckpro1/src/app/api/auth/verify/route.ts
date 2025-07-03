import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// Type safety for decoded token
interface DecodedToken {
	employee_id: string;
	full_name: string;
	email: string;
	position: string;
	status: string;
	iat?: number;
	exp?: number;
}

export async function GET(request: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('auth-token')?.value;

		// 1. Check token existence
		if (!token) {
			return NextResponse.json(
				{ error: 'Authorization token missing' },
				{ status: 401 }
			);
		}

		// 2. Verify and decode token
		const decoded = verifyToken(token) as DecodedToken;

		// 3. Validate required claims
		const requiredClaims = ['employee_id', 'full_name', 'email', 'position', 'status'];
		const missingClaims = requiredClaims.filter(claim => !(claim in decoded));
		
		if (missingClaims.length > 0) {
			return NextResponse.json(
				{ error: `Token missing required claims: ${missingClaims.join(', ')}` },
				{ status: 401 }
			);
		}

		// 4. Prepare safe user data (exclude sensitive/optional fields)
		const userData = {
			employee_id: decoded.employee_id,
			full_name: decoded.full_name,
			email: decoded.email,
			position: decoded.position,
			status: decoded.status
		};

		// 5. Add security headers
		const response = NextResponse.json(userData);
		response.headers.set('Cache-Control', 'no-store');
		
		return response;

	} catch (error) {
		// Handle different error types specifically
		const errorMessage = error instanceof Error ? error.message : 'Token verification failed';
		
		return NextResponse.json(
			{ 
				error: 'Invalid token',
				details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
			},
			{ status: 401 }
		);
	}
}