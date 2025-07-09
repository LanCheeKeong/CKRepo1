"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EmployeeSearchForm from '@/components/employees/searchForm';
import EmployeeTable from '@/components/employees/resultTable';
import type { Employee } from '@/lib/types';

export default function EmployeeDirectory() {
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
	const [sortConfig, setSortConfig] = useState<{
		key: keyof Employee;
		direction: 'ascending' | 'descending';
	}>({ key: 'employee_id', direction: 'ascending' });

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
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchEmployees();
	}, []);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setSearchParams({
			...searchParams,
			[e.target.name]: e.target.value
		});
	};

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		fetchEmployees();
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
		setSortConfig({ key: 'employee_id', direction: 'ascending' });
	};

	const handleRowClick = (id: number) => {
		router.push(`/employees/edit/${id}`);
	};

	const handleAddEmployee = () => {
		router.push('/employees/add');
	};

	const handleSort = (key: keyof Employee) => {
		let direction: 'ascending' | 'descending' = 'ascending';
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });
	};

	return (
		<div className='pb-1'>
			<EmployeeSearchForm
				searchParams={searchParams}
				isLoading={isLoading}
				onSearchChange={handleSearchChange}
				onSearchSubmit={handleSearchSubmit}
				onReset={handleReset}
				onAddEmployee={handleAddEmployee}
			/>

			<EmployeeTable
				employees={employees}
				isLoading={isLoading}
				sortConfig={sortConfig}
				onRowClick={handleRowClick}
				onSort={handleSort}
			/>
		</div>
	);
}