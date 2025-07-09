"use client";
import "./globals.css";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
	HomeIcon,
	UsersIcon,
	BellIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	XMarkIcon,
	Bars3Icon,
	ArrowLeftOnRectangleIcon,
	ArrowPathIcon,
} from "@heroicons/react/24/outline";

type User = {
	name: string;
	email: string;
	role: string;
	employee_id?: string;
	position?: string;
};

type AuthState = {
	user: User | null;
	loading: boolean;
	error: string | null;
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
	const [auth, setAuth] = useState<AuthState>({
		user: null,
		loading: true,
		error: null,
	});
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	// Public routes that don't require authentication
	const publicRoutes = ['/login', '/register', '/forgot-password'];
	const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));

	useEffect(() => {
		// Skip auth check for public routes
		if (isPublicRoute) {
			setAuth(prev => ({ ...prev, loading: false }));
			return;
		}

		const checkAuth = async () => {
			try {
				setAuth(prev => ({ ...prev, loading: true, error: null }));

				const response = await fetch('/api/auth/verify', {
					credentials: 'include',
					headers: { 'Cache-Control': 'no-cache' }
				});

				if (!response.ok) {
					throw new Error('AUTH_REQUIRED');
				}

				const userData = await response.json();
				setAuth({
					user: userData.user,
					loading: false,
					error: null
				});
			} catch (error: any) {
				setAuth({
					user: null,
					loading: false,
					error: error.message
				});

				// Only redirect if not already on a public route
				if (!isPublicRoute) {
					const returnTo = pathname ? encodeURIComponent(pathname) : '';
					router.push(`/login?returnTo=${returnTo}`);
				}
			}
		};

		checkAuth();

		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				checkAuth();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
	}, [router, pathname, isPublicRoute]);

	const handleLogout = async () => {
		try {
			setIsLoggingOut(true); // Set logging out state
			
			const response = await fetch('/api/logout', {
				method: 'POST',
				credentials: 'include',
			});

			if (!response.ok) throw new Error('Logout failed');

			setAuth({ user: null, loading: false, error: null });
			window.location.href = '/login'; // This will completely refresh the page
			
		} catch (error) {
			setIsLoggingOut(false); // Reset if logout fails
			setAuth(prev => ({ ...prev, error: 'Logout failed. Please try again.' }));
		}
	};

	const navItems = [
		{ name: "Dashboard", icon: HomeIcon, href: "/dashboard", key: "dashboard" },
		{ name: "Employees", icon: UsersIcon, href: "/employees", key: "employees" },
		{ name: "Leave Management", icon: ArrowLeftOnRectangleIcon , href: "/leaveManagement", key: "leaveManagement" },
	];

	const isActive = (href: string, key: string) => {
		return pathname === href || (key !== "dashboard" && pathname?.startsWith(href));
	};

	// Show loading state
	if (auth.loading && !isPublicRoute && !isLoggingOut) {
		return (
			<html lang="en" className="h-full">
				<body className="h-full bg-gray-50">
					<div className="flex items-center justify-center h-full w-full"> {/* Added h-full here */}
						<div className="text-center">
							<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
							<p className="mt-4 text-gray-600">Checking authentication...</p>
						</div>
					</div>
				</body>
			</html>
		);
	}

	// Show error state for protected routes when not authenticated
	if (!auth.user && !isPublicRoute && !isLoggingOut) {
		return (
			<html lang="en">
				<body className="bg-gray-50">
					<div className="flex items-center justify-center min-h-screen">
						<div className="text-center p-6 max-w-md">
							<div className="text-red-500 mb-4">
								<XMarkIcon className="h-12 w-12 mx-auto" />
							</div>
							<h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
							<p className="text-gray-600 mb-6">
								{auth.error === 'SESSION_EXPIRED'
									? 'Your session has expired. Please log in again.'
									: 'You need to be authenticated to access this page.'}
							</p>
							<Link
								href={`/login?returnTo=${pathname ? encodeURIComponent(pathname) : ''}`}
								className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
							>
								Go to Login
							</Link>
						</div>
					</div>
				</body>
			</html>
		);
	}


	// Main layout for authenticated users
	return (
		<html lang="en" className="h-full">
			<body className="h-full bg-gray-50 flex flex-col">
				{auth.user ? (
					<div className="flex flex-col lg:flex-row h-full">
						{/* Mobile sidebar overlay */}
						{mobileSidebarOpen && (
							<div className="fixed inset-0 z-50 lg:hidden">
								<div
									className="fixed inset-0 bg-black/50 transition-opacity duration-200 ease-in-out"
									onClick={() => setMobileSidebarOpen(false)}
									aria-hidden="true"
								/>
								
								{/* Mobile sidebar content */}
								<div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-out z-50 h-full flex flex-col">
									<div className="flex items-center justify-between px-6 pt-6 pb-4">
										<h1 className="text-xl font-bold text-gray-900">Leave Tracker</h1>
										<button
											onClick={() => setMobileSidebarOpen(false)}
											className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
											aria-label="Close sidebar"
										>
											<XMarkIcon className="h-5 w-5" />
										</button>
									</div>

									<nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
										{navItems.map((item) => {
											const active = isActive(item.href, item.key);
											return (
												<Link
													key={item.key}
													href={item.href}
													className={`flex items-center px-4 py-3 rounded-xl transition-colors duration-150 ${
														active
															? "bg-blue-50 text-blue-600 font-medium"
															: "text-gray-700 hover:bg-gray-100"
													}`}
													onClick={() => setMobileSidebarOpen(false)}
													aria-current={active ? "page" : undefined}
												>
													<item.icon
														className={`h-5 w-5 flex-shrink-0 ${
															active ? "text-blue-500" : "text-gray-500"
														}`}
													/>
													<span className="ml-3 whitespace-nowrap">{item.name}</span>
												</Link>
											);
										})}
									</nav>

									<div className="border-t border-gray-200 px-4 py-4">
										<div className="flex items-center px-4 py-3">
											<div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
												{auth.user?.name?.charAt(0).toUpperCase() || "U"}
											</div>
											<div className="ml-3">
												<p className="text-sm font-medium text-gray-900 truncate">{auth.user?.name || "User"}</p>
												<p className="text-xs text-gray-500 truncate">{auth.user?.email || ""}</p>
											</div>
										</div>
										<button
											onClick={handleLogout}
											disabled={isLoggingOut}
											className={`flex items-center px-4 py-3 rounded-xl w-full transition-colors duration-150 ${
												isLoggingOut ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
											}`}
											aria-label="Logout"
										>
											{isLoggingOut ? (
												<ArrowPathIcon className="h-5 w-5 flex-shrink-0 animate-spin" />
											) : (
												<ArrowLeftOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
											)}
											<span className="ml-3 whitespace-nowrap">Logout</span>
										</button>
									</div>
								</div>
							</div>
						)}

						{/* Desktop sidebar */}
						<aside
							className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out h-full ${
								sidebarOpen ? "w-64" : "w-20"
							}`}
							onMouseEnter={() => setSidebarOpen(true)}
							onMouseLeave={() => setSidebarOpen(false)}
							aria-label="Sidebar"
						>
							<div className="flex items-center justify-between px-4 pt-6 pb-4">
								{sidebarOpen && (
									<h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">
										The Company REIT
									</h1>
								)}
								<button
									onClick={(e) => {
										e.stopPropagation();
										setSidebarOpen(!sidebarOpen);
									}}
									className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
									aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
								>
									{sidebarOpen ? (
										<ChevronLeftIcon className="h-5 w-5" />
									) : (
										<ChevronRightIcon className="h-5 w-5" />
									)}
								</button>
							</div>

							<nav className="flex-1 px-2 py-4 space-y-1">
								{navItems.map((item) => {
									const active = isActive(item.href, item.key);
									return (
										<Link
											key={item.key}
											href={item.href}
											className={`flex items-center px-4 py-3 rounded-xl transition-colors duration-150 ${
												active
													? "bg-blue-50 text-blue-600 font-medium"
													: "text-gray-700 hover:bg-gray-100"
											}`}
											aria-current={active ? "page" : undefined}
										>
											<item.icon
												className={`h-5 w-5 flex-shrink-0 ${
													active ? "text-blue-500" : "text-gray-500"
												}`}
											/>
											<span className={`ml-3 whitespace-nowrap ${!sidebarOpen ? 'opacity-0 w-0' : 'opacity-100'}`}>
												{item.name}
											</span>
										</Link>
									);
								})}
							</nav>

							<div className="border-t border-gray-200 px-2 py-4">
								<div className={`flex items-center px-2 py-3 ${!sidebarOpen ? 'justify-center' : ''}`}>
									<div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
										{auth.user?.name?.charAt(0).toUpperCase() || "U"}
									</div>
									{sidebarOpen && (
										<div className="ml-3">
											<p className="text-sm font-medium text-gray-900 truncate">{auth.user?.name || "User"}</p>
											<p className="text-xs text-gray-500 truncate">{auth.user?.email || ""}</p>
										</div>
									)}
								</div>

								<button
									onClick={handleLogout}
									disabled={isLoggingOut}
									className={`flex items-center px-2 py-3 rounded-xl w-full transition-colors duration-150 ${
										isLoggingOut ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
									} ${!sidebarOpen ? 'justify-center' : ''}`}
									aria-label="Logout"
								>
									{isLoggingOut ? (
										<ArrowPathIcon className="h-5 w-5 flex-shrink-0 animate-spin" />
									) : (
										<ArrowLeftOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
									)}
									{sidebarOpen && <span className="ml-3 whitespace-nowrap">Logout</span>}
								</button>
							</div>
						</aside>

						{/* Main content area */}
						<div className="flex-1 flex flex-col h-full overflow-hidden">
							<header className="bg-white border-b border-gray-200 sticky top-0 z-10">
								<div className="px-4 sm:px-6 py-3 flex items-center justify-between">
									<div className="flex items-center">
										<button
											type="button"
											className="lg:hidden mr-4 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
											onClick={() => setMobileSidebarOpen(true)}
											aria-label="Open sidebar"
										>
											<Bars3Icon className="h-6 w-6" />
										</button>
										<h1 className="text-lg sm:text-xl font-semibold text-gray-800">
											{navItems.find((item) => isActive(item.href, item.key))?.name || "Dashboard"}
										</h1>
									</div>
									
									<div className="flex items-center space-x-3 sm:space-x-4">
										<button 
											className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 relative"
											aria-label="Notifications"
										>
											<BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
											<span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
										</button>
										
										<div className="hidden lg:flex items-center space-x-3">
											<div className="text-right">
												<p className="text-sm font-medium text-gray-900">{auth.user?.name || "User"}</p>
												<p className="text-xs text-gray-500">{auth.user?.position || ""}</p>
											</div>
											<div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
												{auth.user?.name?.charAt(0).toUpperCase() || "U"}
											</div>
										</div>
									</div>
								</div>
							</header>

							<main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-gray-50">
								<div className="mx-auto max-w-7xl w-full h-full">
									{children}
								</div>
							</main>

							{/* Footer */}
							<footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6">
								<div className="mx-auto max-w-7xl w-full flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
									<div className="mb-2 md:mb-0">
										© {new Date().getFullYear()} The Company REIT. All rights reserved.
									</div>
									<div className="flex items-center space-x-4">
										<span>Version 1.0.0</span>
										<span>Developed by CK</span>
									</div>
								</div>
							</footer>
						</div>
					</div>
				) : (
					// Public route content (like login page)
					<div className="flex-1 flex flex-col h-full">
						<main className="flex-1 overflow-y-auto">
							{children}
						</main>
						<footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6">
							<div className="mx-auto max-w-7xl w-full text-center text-sm text-gray-500">
								© {new Date().getFullYear()} The Company REIT. Developed by CK.
							</div>
						</footer>
					</div>
				)}
			</body>
		</html>
	);
}