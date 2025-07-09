import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
	try {
		const cookieStore = await cookies();
		
		// Clear the auth token cookie
		cookieStore.delete('auth-token');

		return NextResponse.json(
			{ success: true, message: 'Logged out successfully' },
			{
				headers: {
					// Optionally set headers to prevent caching
					'Cache-Control': 'no-store, max-age=0',
					'Pragma': 'no-cache',
				}
			}
		);
	} catch (error) {
		console.error('Logout error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}