import { NextResponse } from 'next/server';

export async function POST() {
	try {
		const response = NextResponse.json(
			{ success: true },
			{ status: 200 }
		);

		// Clear all auth-related cookies
		['auth-token', 'refresh-token'].forEach(name => {
			response.cookies.delete(name);
		});

		// Security headers
		response.headers.set('Cache-Control', 'no-store');
		response.headers.set('Clear-Site-Data', '"cookies", "storage"');

		return response;
	} catch (error) {
		return NextResponse.json(
			{ success: false },
			{ status: 500 }
		);
	}
}

// Optionally keep GET for compatibility
export async function GET() {
	return POST();
}