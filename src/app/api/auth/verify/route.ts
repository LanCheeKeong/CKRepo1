import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

// Cache these values since they won't change between requests
const REQUIRED_CLAIMS = ['employee_id', 'full_name', 'email', 'position', 'status'];
const CACHE_HEADERS = {
	'Cache-Control': 'no-store, max-age=0',
	'Pragma': 'no-cache',
};

export async function GET() {
	// 1. Get token from cookies
	const cookieStore = await cookies();
	const token = cookieStore.get('auth-token')?.value;
	
	// 2. Immediately return if no token
	if (!token) {
		return NextResponse.json(
			{ 
				error: 'AUTH_REQUIRED',
				message: 'Authentication required',
			},
			{ 
				status: 401,
				headers: CACHE_HEADERS
			}
		);
	}

	try {
		// 3. Verify token (includes expiration check)
		const decoded = verifyToken(token);

		// 4. Validate claims structure
		const missingClaims = REQUIRED_CLAIMS.filter(claim => !decoded.hasOwnProperty(claim));
		if (missingClaims.length > 0) {
			return NextResponse.json(
				{ 
					error: 'INVALID_CLAIMS',
					message: 'Invalid token structure',
					missing: missingClaims 
				},
				{ 
					status: 401,
					headers: CACHE_HEADERS
				}
			);
		}

		// 5. Check if user still exists in database and is active
		const client = await pool.connect();
		try {
			const userResult = await client.query(
				'SELECT employee_id, status FROM t_user_mstr WHERE employee_id = $1',
				[decoded.employee_id]
			);

			if (userResult.rows.length === 0) {
				return NextResponse.json(
					{ 
						error: 'USER_NOT_FOUND',
						message: 'User account no longer exists' 
					},
					{ 
						status: 401,
						headers: CACHE_HEADERS
					}
				);
			}

			const dbUser = userResult.rows[0];
			
			// 6. Check account status
			if (dbUser.status !== 'A') {
				return NextResponse.json(
					{ 
						error: 'ACCOUNT_INACTIVE',
						message: 'Account is not active' 
					},
					{ 
						status: 403,
						headers: CACHE_HEADERS
					}
				);
			}

			// 7. Return minimal user data with security headers
			return NextResponse.json(
				{
					user: {
						id: decoded.employee_id,
						name: decoded.full_name,
						email: decoded.email,
						role: decoded.position,
						status: decoded.status
					},
					meta: {
						iat: decoded.iat,
						exp: decoded.exp,
						ttl: decoded.exp ? Math.max(0, decoded.exp - Math.floor(Date.now() / 1000)) : null
					}
				},
				{
					headers: CACHE_HEADERS
				}
			);
		} finally {
			client.release();
		}

	} catch (error: any) {
		// Error handling remains the same as before
		let errorCode = 'AUTH_FAILED';
		let message = 'Authentication failed';
		let status = 401;

		if (error.name === 'TokenExpiredError') {
			errorCode = 'SESSION_EXPIRED';
			message = 'Session expired, please log in again';
		} else if (error.name === 'JsonWebTokenError') {
			errorCode = 'INVALID_TOKEN';
			message = 'Invalid authentication token';
		} else if (error.name === 'NotBeforeError') {
			errorCode = 'TOKEN_NOT_ACTIVE';
			message = 'Token not yet valid';
		}

		return NextResponse.json(
			{ 
				error: errorCode,
				message: message,
				...(process.env.NODE_ENV === 'development' && {
					debug: {
						reason: error.message,
						stack: error.stack
					}
				})
			},
			{ 
				status: status,
				headers: CACHE_HEADERS
			}
		);
	}
}