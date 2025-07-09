'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		name: '',
		password: '',
		email: '',
	});
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			const response = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Registration failed');
			}

			// Redirect to login after successful registration
			router.push('/login?registered=true');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Registration failed');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
				<h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
				
				{error && (
					<div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">
							Username *
						</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) => setFormData({...formData, name: e.target.value})}
							className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
							required
							minLength={3}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Password *
						</label>
						<input
							type="password"
							value={formData.password}
							onChange={(e) => setFormData({...formData, password: e.target.value})}
							className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
							required
							minLength={6}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Email (Optional)
						</label>
						<input
							type="email"
							value={formData.email}
							onChange={(e) => setFormData({...formData, email: e.target.value})}
							className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className={`w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
							isLoading ? 'opacity-70 cursor-not-allowed' : ''
						}`}
					>
						{isLoading ? 'Creating Account...' : 'Register'}
					</button>
				</form>

				<div className="mt-4 text-center">
					<p className="text-sm text-gray-600">
						Already have an account?{' '}
						<a href="/login" className="text-blue-600 hover:underline">
							Sign in
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}