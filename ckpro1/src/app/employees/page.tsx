"use client";
import { useState, useEffect } from 'react';
import type { Employee } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function EmployeeSearch() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [searchParams, setSearchParams] = useState({
		employee_id: '',
		full_name: '',
		ic: '',
		department_id: '',
		status: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const fetchEmployees = async (params = searchParams) => {
		setIsLoading(true);
		try {
			const query = new URLSearchParams();
			Object.entries(params).forEach(([key, value]) => {
				if (value) query.append(key, value);
			});

			const res = await fetch(`/api/employees?${query}`);
			if (!res.ok) throw new Error('Failed to fetch employees');
			const data = await res.json();
			setEmployees(data);
		} catch (error) {
			console.error('Fetch error:', error);
			// You might want to show an error toast/message here
		} finally {
			setIsLoading(false);
		}
	};

	const handleReset = () => {
		const resetParams = {
			employee_id: '',
			full_name: '',
			ic: '',
			department_id: '',
			status: '',
		};
		setSearchParams(resetParams);
		fetchEmployees(resetParams);
	};

	useEffect(() => {
		fetchEmployees();
	}, []);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		fetchEmployees();
	};

	const handleRowClick = (id: number) => {
		// Enhanced navigation with better error handling
		try {
			router.push(`/employees/edit/${id}`);
		} catch (error) {
			console.error('Navigation error:', error);
			// Handle navigation error (e.g., show a toast message)
		}
	};

	const handleAddEmployee = () => {
		router.push('/employees/add');
	};

	return (
		<>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Employee Directory</h1>
			</div>
			
			{/* Search Form */}
			<form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
						<input
							type="number"
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							value={searchParams.employee_id}
							onChange={(e) => setSearchParams({...searchParams, employee_id: e.target.value})}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
						<input
							type="text"
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							value={searchParams.full_name}
							onChange={(e) => setSearchParams({...searchParams, full_name: e.target.value})}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">IC Number</label>
						<input
							type="text"
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							value={searchParams.ic}
							onChange={(e) => setSearchParams({...searchParams, ic: e.target.value})}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
						<select
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							value={searchParams.status}
							onChange={(e) => setSearchParams({...searchParams, status: e.target.value})}
						>
							<option value="">All</option>
							<option value="A">Active</option>
							<option value="I">Inactive</option>
						</select>
					</div>
				</div>
				<div className="mt-6 flex justify-end space-x-3">
					<button
						type="button"
						onClick={handleReset}
						className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition flex items-center"
					>
						<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						Reset
					</button>
					<button
						type="button"
						onClick={handleAddEmployee}
						className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
					>
						<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
						</svg>
						Add Employee
					</button>
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Searching...
							</>
						) : (
							<>
								<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
								Search
							</>
						)}
					</button>
				</div>
			</form>

			{/* Results Table */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
				{isLoading ? (
					<div className="p-8 text-center text-gray-500">
						<svg className="animate-spin mx-auto h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<p className="mt-2">Loading employees...</p>
					</div>
				) : employees.length === 0 ? (
					<div className="p-8 text-center text-gray-500">
						<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<p className="mt-2">No employees found matching your criteria</p>
						<button
							onClick={handleReset}
							className="mt-4 text-sm text-blue-600 hover:text-blue-800"
						>
							Clear search filters
						</button>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emp. ID</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{employees.map((emp) => (
									<tr 
										key={emp.employee_id}
										onClick={() => handleRowClick(emp.employee_id)}
										className="hover:bg-gray-50 cursor-pointer transition"
									>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.employee_id}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.full_name}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.department_id || '-'}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.position || '-'}</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
												${emp.status === 'A' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
												{emp.status === 'A' ? 'Active' : 'Inactive'}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</>
	);
}