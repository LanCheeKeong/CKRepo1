// lib/session.ts
import { randomBytes } from 'crypto';

// Generate a secure session token
export function generateSessionToken(userId: number): string {
		return `${userId}.${randomBytes(32).toString('hex')}`;
}

// Validate session token (for use in middleware)
export function validateSessionToken(token: string): { isValid: boolean, userId?: number } {
		const parts = token?.split('.');
		if (!parts || parts.length !== 2) return { isValid: false };
		
		const userId = Number(parts[0]);
		if (!Number.isInteger(userId) || userId <= 0) return { isValid: false };
		
		return { isValid: true, userId };
}