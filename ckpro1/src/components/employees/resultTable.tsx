"use client";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import type { Employee } from "@/lib/types";

interface EmployeeTableProps {
	employees: Employee[];
	isLoading: boolean;
	sortConfig: {
		key: keyof Employee;
		direction: 'ascending' | 'descending';
	};
	onRowClick: (id: number) => void;
	onSort: (key: keyof Employee) => void;
}

export default function EmployeeTable({
	employees,
	isLoading,
	sortConfig,
	onRowClick,
	onSort,
}: EmployeeTableProps) {
	const sortedEmployees = [...employees].sort((a, b) => {
		const aValue = a[sortConfig.key] || '';
		const bValue = b[sortConfig.key] || '';
		
		if (typeof aValue === 'string' && typeof bValue === 'string') {
			const aLower = aValue.toLowerCase();
			const bLower = bValue.toLowerCase();
			
			if (aLower < bLower) {
				return sortConfig.direction === 'ascending' ? -1 : 1;
			}
			if (aLower > bLower) {
				return sortConfig.direction === 'ascending' ? 1 : -1;
			}
			return 0;
		}
		
		if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
		if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
		return 0;
	});

	const getSortIcon = (key: keyof Employee) => {
		if (sortConfig.key !== key) return null;
		return sortConfig.direction === 'ascending' ? 
			<FaArrowUp className="ml-1 inline" size={12} /> : 
			<FaArrowDown className="ml-1 inline" size={12} />;
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
			{isLoading ? (
				<div className="p-8 text-center text-gray-500">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
					<p className="mt-4">Loading employees...</p>
				</div>
			) : employees.length === 0 ? (
				<div className="p-8 text-center text-gray-500">
					<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<p className="mt-2">No employees found matching your criteria</p>
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								{['employee_id', 'full_name', 'department_id', 'position', 'status'].map((key) => (
									<th
										key={key}
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
										onClick={() => onSort(key as keyof Employee)}
									>
										<div className="flex items-center">
											{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
											{getSortIcon(key as keyof Employee)}
										</div>
									</th>
								))}
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{sortedEmployees.map((emp) => (
								<tr 
									key={emp.employee_id}
									onClick={() => onRowClick(emp.employee_id)}
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
	);
}