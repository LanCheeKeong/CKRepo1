'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
		const [formData, setFormData] = useState({
				full_name: '', // Changed
				email: '',
				password: '',
				position: '',
				department_id: '',
				hire_date: '',
				secret_key: '',
		});
		
		const [error, setError] = useState('');
		const [isLoading, setIsLoading] = useState(false);
		const router = useRouter();

		const handleSubmit = async (e: React.FormEvent) => {
				e.preventDefault();
				setIsLoading(true);
				setError('');

				if (!formData.secret_key) {
						setError('Secret key is required.');
						setIsLoading(false);
						return;
				}

				try {
						const payload = {
								...formData,
								status: 'A',
								department_id: formData.department_id ? parseInt(formData.department_id) : null,
								hire_date: formData.hire_date || new Date().toISOString().split('T')[0],
						};

						const response = await fetch('/api/register', {
								method: 'POST',
								headers: {
										'Content-Type': 'application/json',
								},
								body: JSON.stringify(payload),
						});

						const data = await response.json();

						if (!response.ok) {
								throw new Error(data.error || 'Registration failed');
						}

						router.push('/login?registered=true');
				} catch (err) {
						setError(err instanceof Error ? err.message : 'Registration failed');
				} finally {
						setIsLoading(false);
				}
		};

		const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
				const { name, value } = e.target;
				setFormData(prev => ({
						...prev,
						[name]: value
				}));
		};

		return (
				<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
						<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
								<h1 className="text-2xl font-bold mb-6 text-center">Add New User</h1>
								
								{error && (
										<div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
												{error}
										</div>
								)}

								<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{/* Personal Information Column */}
										<div className="space-y-4">
												<h2 className="text-lg font-semibold">Personal Information</h2>
												
												<div>
														<label className="block text-sm font-medium mb-1">
																Full Name *
														</label>
														<input
																type="text"
																name="full_name"
																value={formData.full_name}
																onChange={handleChange}
																className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
																required
														/>
												</div>

												<div>
														<label className="block text-sm font-medium mb-1">
																Email
														</label>
														<input
																type="email"
																name="email"
																value={formData.email}
																onChange={handleChange}
																className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
														/>
												</div>
												
												<div>
														<label className="block text-sm font-medium mb-1">
																Secret Key *
														</label>
														<input
																type="password"
																name="secret_key"
																value={formData.secret_key}
																onChange={handleChange}
																className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
																required
														/>
												</div>
										</div>

										{/* Account & Employment Information Column */}
										<div className="space-y-4">
												<h2 className="text-lg font-semibold">Account & Employment Information</h2>
												
												<div>
														<label className="block text-sm font-medium mb-1">
																Password *
														</label>
														<input
																type="password"
																name="password"
																value={formData.password}
																onChange={handleChange}
																className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
																required
																minLength={8}
														/>
														<p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
												</div>

												<div>
														<label className="block text-sm font-medium mb-1">
																Position
														</label>
														<input
																type="text"
																name="position"
																value={formData.position}
																onChange={handleChange}
																className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
														/>
												</div>

												<div>
														<label className="block text-sm font-medium mb-1">
																Department
														</label>
														<select
																name="department_id"
																value={formData.department_id}
																onChange={handleChange}
																className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
														>
																<option value="">Select Department</option>
																<option value="1">HR</option>
																<option value="2">IT</option>
																<option value="3">Finance</option>
																<option value="4">Operations</option>
														</select>
												</div>

												<div>
														<label className="block text-sm font-medium mb-1">
																Hire Date
														</label>
														<input
																type="date"
																name="hire_date"
																value={formData.hire_date}
																onChange={handleChange}
																className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
														/>
												</div>
										</div>

										{/* Full-width submit button */}
										<div className="md:col-span-2 pt-4">
												<button
														type="submit"
														disabled={isLoading}
														className={`w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
																isLoading ? 'opacity-70 cursor-not-allowed' : ''
														}`}
												>
														{isLoading ? 'Creating User...' : 'Add User'}
												</button>
										</div>
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