"use client";
import "./globals.css";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
	HomeIcon,
	UsersIcon,
	CalendarIcon,
	DocumentTextIcon,
	CogIcon,
	BellIcon,
	ArrowLeftOnRectangleIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	XMarkIcon,
	Bars3Icon,
} from "@heroicons/react/24/outline";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
	const [user, setUser] = useState<{ name: string; email: string } | null>(null);
	const [checkingAuth, setCheckingAuth] = useState(true);

	// Check auth status on mount
	useEffect(() => {
			const userData = sessionStorage.getItem("user");
			console.log(userData)
			
			if (
					!userData &&
					!pathname.startsWith("/login") 
					/* && !pathname.startsWith("/register") */
			) {
					router.push("/login");
			} else if (userData) {
					setUser(JSON.parse(userData));
			}
			
			setCheckingAuth(false); // Ensures the loading spinner disappears after the check
	}, [router, pathname]);

	const handleLogout = () => {
		sessionStorage.removeItem("user");
		router.push("/login");
	};

	const navItems = [
		{ name: "Dashboard", icon: HomeIcon, href: "/dashboard", key: "dashboard" },
		{ name: "Employees", icon: UsersIcon, href: "/employees", key: "employees" },
	];

	const isActive = (href: string, key: string) => {
		return pathname === href || (key !== "dashboard" && pathname.startsWith(href));
	};

	// Don't show sidebar on login page
	if (pathname.startsWith("/login")) {
		return (
			<html lang="en">
				<body className="bg-gray-50">{children}</body>
			</html>
		);
	}

	if (checkingAuth) {
		return (
			<html lang="en">
				<body>
					<div className="flex items-center justify-center h-screen">
						<span>Loading...</span>
					</div>
				</body>
			</html>
		);
	}

	if(user !== null){
		return (
		<html lang="en">
			<body className="bg-gray-50">
				<div className="flex h-screen">
					{/* Mobile sidebar */}
					<div
						className={`fixed inset-0 z-40 lg:hidden ${
							mobileSidebarOpen ? "block" : "hidden"
						}`}
					>
						<div
							className="fixed inset-0 bg-gray-600 bg-opacity-75"
							onClick={() => setMobileSidebarOpen(false)}
						></div>
						<div className="fixed inset-y-0 left-0 flex max-w-xs w-full">
							<div className="relative flex-1 flex flex-col w-full bg-white">
								<div className="absolute top-0 right-0 -mr-12 pt-2">
									<button
										type="button"
										className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
										onClick={() => setMobileSidebarOpen(false)}
									>
										<span className="sr-only">Close sidebar</span>
										<XMarkIcon className="h-6 w-6 text-white" />
									</button>
								</div>
								<div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
									<div className="flex-shrink-0 flex items-center px-4">
										<h1 className="text-xl font-bold text-gray-900">Leave Tracker</h1>
									</div>
									<nav className="mt-5 px-2 space-y-1">
										{navItems.map((item) => {
											const active = isActive(item.href, item.key);
											return (
												<Link
													key={item.key}
													href={item.href}
													className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
														active
															? "bg-blue-100 text-blue-600"
															: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
													}`}
													onClick={() => setMobileSidebarOpen(false)}
												>
													<item.icon
														className={`mr-4 flex-shrink-0 h-6 w-6 ${
															active
																? "text-blue-500"
																: "text-gray-400 group-hover:text-gray-500"
														}`}
													/>
													{item.name}
												</Link>
											);
										})}
									</nav>
								</div>
								<div className="flex-shrink-0 flex border-t border-gray-200 p-4">
									<div className="flex items-center">
										<div className="ml-3">
											<p className="text-sm font-medium text-gray-700">
												{user?.name || "User"}
											</p>
											<button
												onClick={handleLogout}
												className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center"
											>
												<ArrowLeftOnRectangleIcon className="h-4 w-4 mr-1" />
												Sign out
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Desktop sidebar */}
					<div
						className={`hidden lg:flex lg:flex-shrink-0 ${
							sidebarOpen ? "lg:w-64" : "lg:w-20"
						} transition-all duration-300 ease-in-out`}
					>
						<div className="flex flex-col w-full border-r border-gray-200 bg-white">
							<div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
								<div className="flex items-center px-4">
									<button
										onClick={() => setSidebarOpen(!sidebarOpen)}
										className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
									>
										{sidebarOpen ? (
											<ChevronLeftIcon className="h-5 w-5" />
										) : (
											<ChevronRightIcon className="h-5 w-5" />
										)}
									</button>
									{sidebarOpen && (
										<h1 className="ml-2 text-xl font-bold text-gray-900">
											The Company REIT
										</h1>
									)}
								</div>
								<nav className="mt-5 flex-1 px-2 space-y-1">
									{navItems.map((item) => {
										const active = isActive(item.href, item.key);
										return (
											<Link
												key={item.key}
												href={item.href}
												className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
													active
														? "bg-blue-100 text-blue-600"
														: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
												}`}
											>
												<item.icon
													className={`flex-shrink-0 h-6 w-6 ${
														active
															? "text-blue-500"
															: "text-gray-400 group-hover:text-gray-500"
													}`}
												/>
												<span className={`ml-3 ${!sidebarOpen && "hidden"}`}>
													{item.name}
												</span>
											</Link>
										);
									})}
								</nav>
							</div>
							<div className="flex-shrink-0 flex border-t border-gray-200 p-4">
								<div className="flex items-center w-full">
									<div className={`${!sidebarOpen ? "ml-1" : "ml-3"} flex-grow`}>
										<p
											className={`text-sm font-medium text-gray-700 ${
												!sidebarOpen && "hidden"
											}`}
										>
											{user?.name || "User"}
										</p>
										<button
											onClick={handleLogout}
											className={`text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center ${
												!sidebarOpen && "justify-center"
											}`}
										>
											<ArrowLeftOnRectangleIcon className="h-4 w-4 mr-1" />
											{sidebarOpen && "Sign out"}
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Main content */}
					<div className="flex-1 flex flex-col overflow-hidden">
						{/* Top navigation */}
						<header className="bg-white shadow-sm z-10">
							<div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
								<button
									type="button"
									className="lg:hidden text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
									onClick={() => setMobileSidebarOpen(true)}
								>
									<span className="sr-only">Open sidebar</span>
									<Bars3Icon className="h-6 w-6" />
								</button>
								<h1 className="text-xl font-semibold text-gray-800 capitalize">
									{navItems.find((item) => isActive(item.href, item.key))?.name || "Dashboard"}
								</h1>
								<div className="flex items-center space-x-4">
									<button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative">
										<span className="sr-only">View notifications</span>
										<BellIcon className="h-6 w-6" />
										<span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
									</button>
									<div className="flex items-center">
										<div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
											{user?.name?.charAt(0).toUpperCase() || "U"}
										</div>
										<div className="ml-2">
											<p className="text-sm font-medium text-gray-700">
												{user?.name || "User"}
											</p>
										</div>
									</div>
								</div>
							</div>
						</header>

						{/* Main content area */}
						<main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
							{children}
						</main>
					</div>
				</div>
			</body>
		</html>
		);
	}
	
}