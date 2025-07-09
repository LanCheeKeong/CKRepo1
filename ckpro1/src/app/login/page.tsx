"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			// Validate inputs
			if (!name.trim() || !password) {
				throw new Error("Username and password are required");
			}

			const response = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Login failed");
			}

			// Store minimal user data in session
			sessionStorage.setItem('user', JSON.stringify(data.user));
			
			router.push("/dashboard");
			
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="bg-white rounded-xl shadow-2xl p-8">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-800">The Company Portal</h1>
						<p className="text-gray-600 mt-2">Enter your credentials</p>
					</div>

					{error && (
						<div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Username
							</label>
							<input
								id="name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
								placeholder="Enter your username"
								required
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
								placeholder="Enter your password"
								required
							/>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 ${
								isLoading ? "opacity-70 cursor-not-allowed" : "hover:shadow-md"
							}`}
						>
							{isLoading ? (
								<span className="flex items-center justify-center">
									<svg
										className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Signing in...
								</span>
							) : (
								"Sign In"
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}