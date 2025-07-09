// app/employees/add/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { Employee } from '@/lib/types';

import PersonalInfoSection from '@/components/employees/addEdit/personalInfoSection';
import SecurityInfoSection from '@/components/employees/addEdit/securityInfoSection';
import EmploymentDetailsSection from '@/components/employees/addEdit/employmentDetailsSection';
import StatutoryInfoSection from '@/components/employees/addEdit/statutoryInfoSection';
import FormActions from '@/components/employees/addEdit/action';

export default function EmployeeAdd() {
	const [editForm, setEditForm] = useState<Partial<Employee> & { confirmPassword?: string }>({
		status: 'A', gender: '', role: '', password: '',
		basic_salary: undefined, epf_percent: undefined, socso_percent: undefined, tax_percent: undefined
	});
	const [isLoading, setIsLoading] = useState(false);
	const [isRedirecting, setIsRedirecting] = useState(false);
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const router = useRouter();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		setEditForm(prev => ({ ...prev, [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value }));
		if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: undefined }));
	};

	const validateForm = () => {
		const errors: Record<string, string> = {};
		if (!editForm.full_name?.trim()) errors.full_name = 'Full name is required';
		if (!editForm.status) errors.status = 'Status is required';
		if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) errors.email = 'Invalid email format';
		if (editForm.ic && !/^\d{6}-\d{2}-\d{4}$/.test(editForm.ic)) errors.ic = 'IC format should be XXXXXX-XX-XXXX';
		if (editForm.password !== editForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';

		const numberFields = [
			{ name: 'basic_salary', label: 'Basic Salary', min: 0, max: 999999 },
			{ name: 'epf_percent', label: 'EPF Percentage', min: 0, max: 20 },
			{ name: 'socso_percent', label: 'SOCSO Percentage', min: 0, max: 5 },
			{ name: 'tax_percent', label: 'Tax Percentage', min: 0, max: 30 }
		];

		numberFields.forEach(field => {
			const value = editForm[field.name as keyof typeof editForm];
			if (value && value.toString().trim() !== '') {
				const num = Number(value);
				if (isNaN(num)) errors[field.name] = `${field.label} must be a number`;
				else if (num < field.min) errors[field.name] = `${field.label} cannot be less than ${field.min}`;
				else if (num > field.max) errors[field.name] = `${field.label} cannot exceed ${field.max}`;
			}
		});

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return toast.error('Please fix the form errors');
		setIsLoading(true);

		try {
			const employeeData = {
				full_name: editForm.full_name || '',
				password: editForm.password || '',
				email: editForm.email || null,
				status: editForm.status as 'A' | 'I' || 'A',
				position: editForm.position || null,
				department_id: editForm.department_id ? Number(editForm.department_id) : null,
				hire_date: editForm.join_date || null,
				phone: editForm.phone || null,
				gender: editForm.gender || null,
				date_of_birth: editForm.date_of_birth || null,
				role: editForm.role || null,
				basic_salary: editForm.basic_salary ? Number(editForm.basic_salary) : null,
				epf_number: editForm.epf_number || null,
				epf_percent: editForm.epf_percent ? Number(editForm.epf_percent) : null,
				socso_number: editForm.socso_number || null,
				socso_percent: editForm.socso_percent ? Number(editForm.socso_percent) : null,
				tax_percent: editForm.tax_percent ? Number(editForm.tax_percent) : null,
				ic: editForm.ic || null
			};

			const response = await fetch('/api/employees', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(employeeData),
			});

			if (!response.ok) throw new Error((await response.json()).error || 'Failed to create employee');

			const result = await response.json();
			setIsRedirecting(true);
			toast.success('Employee created successfully!', {
				position: 'top-center', 
				autoClose: 500,
				className: 'bg-black text-white',
				progressClassName: 'bg-blue-500',
				onClose: () => router.push(`/employees/edit/${result.employee_id}`)
			});

		} catch (error) {
			console.error('Create failed:', error);
			toast.error(error instanceof Error ? error.message : 'Failed to create employee', { position: 'top-center' });
		} finally {
			setIsLoading(false);
		}
	};

	const handleBackToSearch = () => {
		if (!isLoading && !isRedirecting) router.push('/employees');
	};

	return (
		<div>
			<ToastContainer 
				position="top-center"
				autoClose={500}
				toastClassName="bg-black text-white rounded-lg shadow-lg"
				progressClassName="bg-blue-500"
			/>

			{isRedirecting && (
				<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
						<p className="text-lg font-medium text-gray-800">Redirecting to employee edit page...</p>
					</div>
				</div>
			)}

			<div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-6xl mx-auto ${isRedirecting ? 'opacity-50 pointer-events-none' : ''}`}>
				<div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
					<button onClick={handleBackToSearch} disabled={isLoading || isRedirecting} className={`flex items-center text-sm font-medium ${isLoading || isRedirecting ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800'} transition`}>
						<svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
						</svg>
						Back to Employee List
					</button>
					<h2 className="text-lg font-semibold text-gray-800">Add New Employee</h2>
				</div>

				<form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-8">
					<PersonalInfoSection 
						form={editForm} 
						onChange={handleInputChange} 
						errors={formErrors} 
					/>
					<SecurityInfoSection 
						form={editForm} 
						onChange={handleInputChange} 
						errors={formErrors} 
					/>
					<EmploymentDetailsSection 
						form={editForm} 
						onChange={handleInputChange} 
						errors={formErrors} 
					/>
					<StatutoryInfoSection 
						form={editForm} 
						onChange={handleInputChange} 
						errors={formErrors} 
					/>
					<FormActions 
						isLoading={isLoading} 
						isRedirecting={isRedirecting} 
						isEdit={false} 
						onBack={handleBackToSearch} 
						hasChanges={true}
					/>
				</form>
			</div>
		</div>
	);
}
