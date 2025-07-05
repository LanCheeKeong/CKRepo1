import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from './src/lib/auth';

// Cache public paths as Set for O(1) lookups
const PUBLIC_PATHS = new Set([
	'/login',
	'/register',
	'/api/auth/login',
	'/api/auth/register',
	'/api/auth/verify' // Have token verification endpoint
]);

// Paths that should never be cached
const DYNAMIC_PATHS = new Set([
	'/api/auth/logout'
]);

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get('auth-token')?.value;

	// 1. Bypass middleware for static files and API/auth routes
	if (
		pathname.startsWith('/_next/') ||
		pathname.startsWith('/static/') ||
		PUBLIC_PATHS.has(pathname)
	) {
		return NextResponse.next();
	}

	// 2. Verify token if present
	let isValidToken = false;
	if (token) {
		try {
			isValidToken = Boolean(await verifyToken(token));
		} catch (error) {
			console.error('Token verification failed:', error);
			// Force clear invalid token
			const response = NextResponse.redirect(new URL('/login', request.url));
			response.cookies.delete('auth-token');
			return response;
		}
	}

	// 3. Handle protected routes
	if (!isValidToken) {
		const loginUrl = new URL('/login', request.url);
		loginUrl.searchParams.set('from', pathname); // Track original destination
		return NextResponse.redirect(loginUrl);
	}

	// 4. Prevent authenticated users from accessing auth pages
	if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	// 5. Add security headers for protected routes
	const response = NextResponse.next();
	if (!DYNAMIC_PATHS.has(pathname)) {
		response.headers.set('Cache-Control', 'private, no-cache, no-store');
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folders
		 */
		'/((?!_next/static|_next/image|favicon.ico).*)',
	],
};