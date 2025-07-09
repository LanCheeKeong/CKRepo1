// utils/auth.ts
let isVerifying = false; // Prevents multiple simultaneous verifications

export async function verifySession(): Promise<{
	user: { id: string; name: string; email: string; role: string };
	meta: { ttl: number };
}> {
	if (isVerifying) {
		throw new Error('Verification already in progress');
	}

	isVerifying = true;
	
	try {
		const response = await fetch('/api/auth/verify', {
			credentials: 'include', // Ensures cookies are sent
			headers: {
				'Cache-Control': 'no-cache',
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			await handleAuthError(errorData);
			throw new Error(errorData.message);
		}

		return await response.json();
	} finally {
		isVerifying = false;
	}
}

async function handleAuthError(errorData: {
	error: string;
	message: string;
}) {
	// Store current route for post-login redirect
	const returnTo = window.location.pathname + window.location.search;
	sessionStorage.setItem('returnTo', returnTo);

	switch (errorData.error) {
		case 'SESSION_EXPIRED':
			// Optional: Clear any stale auth state
			localStorage.removeItem('user');
			window.location.href = `/login?error=session_expired&returnTo=${encodeURIComponent(returnTo)}`;
			break;

		case 'ACCOUNT_INACTIVE':
			// Custom UI handling for inactive accounts
			await showAccountDisabledModal();
			break;

		case 'INVALID_TOKEN':
			// Clear potentially corrupted token
			document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
			window.location.href = `/login?error=invalid_token&returnTo=${encodeURIComponent(returnTo)}`;
			break;

		default:
			window.location.href = `/login?error=auth_required&returnTo=${encodeURIComponent(returnTo)}`;
	}

	// Wait for navigation to complete
	await new Promise(() => {});
}