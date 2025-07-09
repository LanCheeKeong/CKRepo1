import jwt from 'jsonwebtoken';

// Password functions using Web Crypto API (replaces Node's crypto)
const encoder = new TextEncoder();

export async function generateSalt(): Promise<string> {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	return Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password: string, salt: string): Promise<string> {
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		{ name: 'PBKDF2' },
		false,
		['deriveBits']
	);

	const key = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: encoder.encode(salt),
			iterations: 100000,
			hash: 'SHA-256'
		},
		keyMaterial,
		256
	);
	
	const hashArray = Array.from(new Uint8Array(key));
	return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(
	inputPassword: string,
	storedHash: string,
	salt: string
): Promise<boolean> {
	const inputHash = await hashPassword(inputPassword, salt);
	return inputHash === storedHash;
}

// Status constants
export const UserStatus = {
	ACTIVE: 'A',
	INACTIVE: 'I'
} as const;

// JWT functions
const JWT_SECRET = process.env.JWT_SECRET;

interface TokenPayload {
	employee_id: number;
	full_name: string;
	email: string;
	position: string;
	status: string;
	iat: number;
	exp: number;
}

if (!JWT_SECRET) {
	throw new Error('JWT_SECRET is not configured');
}

export function verifyToken(token: string): TokenPayload {
	console.log('Verifying token:', token);
	if (!token) {
		throw new Error('No token provided');
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET, {
			algorithms: ['HS256'], // Explicit algorithm
			clockTolerance: 15, // 15-second leeway for clock skew
			ignoreExpiration: false, // Explicitly check expiration
		}) as TokenPayload;

		// Validate required claims
		const requiredClaims: Array<keyof TokenPayload> = [
			'employee_id', 
			'full_name', 
			'status'
		];

		const missingClaims = requiredClaims.filter(claim => !decoded[claim]);
		if (missingClaims.length > 0) {
			throw new Error(`Missing required claims: ${missingClaims.join(', ')}`);
		}

		return decoded;

	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			throw new Error('Token expired');
		}
		if (error instanceof jwt.JsonWebTokenError) {
			throw new Error('Invalid token signature');
		}
		throw error; // Re-throw other errors
	}
}

// Enhanced cookie utilities
export function getAuthCookie(token: string, maxAge = 86400): string {
	return `auth-token=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Strict${
		process.env.NODE_ENV === 'development' ? '; Secure' : ''
	}`;
}

export function clearAuthCookie(): string {
	return `auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly${
		process.env.  NODE_ENV === 'development' ? '; Secure' : ''
	}`;
}

// Optional: Token generation (if you need it in the same file)
export function generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
	return jwt.sign(payload, JWT_SECRET, {
		algorithm: 'HS256',
		expiresIn: '8h', // Token expires in 8 hours
	});
}
